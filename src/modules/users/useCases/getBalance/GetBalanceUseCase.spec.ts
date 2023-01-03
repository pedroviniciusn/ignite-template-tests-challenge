import { 
  InMemoryStatementsRepository,
} from '@modules/statements/repositories/in-memory/InMemoryStatementsRepository';

import InMemoryUsersRepository from '@modules/users/repositories/in-memory/InMemoryUsersRepository';

import { 
  AuthenticateUserUseCase,
} from '@modules/users/useCases/authenticateUser/AuthenticateUserUseCase';

import { 
  CreateUserUseCase,
} from '@modules/users/useCases/createUser/CreateUserUseCase';

import { 
  ICreateUserDTO,
} from '@modules/users/useCases/createUser/ICreateUserDTO';

import { 
  AppError,
} from '@shared/errors/AppError';

import { 
  CreateStatementUseCase,
} from '../../../statements/useCases/createStatement/CreateStatementUseCase';

import { 
  ICreateStatementDTO,
} from '../../../statements/useCases/createStatement/ICreateStatementDTO';

import { 
  GetBalanceUseCase,
} from './GetBalanceUseCase';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase; 
let createStatementUseCase: CreateStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get all statements", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository,
    );
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository,
    );
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
  });

  it("Should be able to get all operations and balance", async () => {
    const user: ICreateUserDTO = {
      name: "User 1",
      email: "test@balance.com",
      password: "123456"
    };

    await createUserUseCase.execute(user);

    const userResult = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    const statementDeposit: ICreateStatementDTO = {
      user_id: userResult.user.id,
      description: "test",
      amount: 100.00,
      type: 'deposit' as OperationType,
    };

    const statementWithdraw: ICreateStatementDTO = {
      user_id: userResult.user.id,
      description: "test",
      amount: 50.00,
      type: 'withdraw' as OperationType,
    };

    await createStatementUseCase.execute(statementDeposit);

    await createStatementUseCase.execute(statementWithdraw);

    const userBalances = await getBalanceUseCase.execute({
      user_id: userResult.user.id,
    });

    expect(userBalances).toHaveProperty('statement')
    expect(userBalances).toHaveProperty('balance')
  });

  it(
    "Should not be able to get all operations and balance if user not authenticated",
    async () => {
      expect(async () => {
        const user: ICreateUserDTO = {
          name: "User 2",
          email: "test@balance2.com",
          password: "123456"
        };
    
        await createUserUseCase.execute(user);
    
        const userResult = await authenticateUserUseCase.execute({
          email: 'test@error.com',
          password: user.password,
        });

        await getBalanceUseCase.execute({
          user_id: userResult.user.id,
        });
      }).rejects.toBeInstanceOf(AppError);
    }
  );

  it(
    "Should not be able to get all operations and balance if user not exists",
    async () => {
      expect(async () => {
        await getBalanceUseCase.execute({
          user_id: "1238748",
        });
      }).rejects.toBeInstanceOf(AppError);
    }
  );
});