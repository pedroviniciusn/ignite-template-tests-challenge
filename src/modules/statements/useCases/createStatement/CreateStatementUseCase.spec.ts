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
} from './CreateStatementUseCase';

import { 
  ICreateStatementDTO,
} from './ICreateStatementDTO';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase; 
let createStatementUseCase: CreateStatementUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create Statement", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository,
    );
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
  });

  it("Should be able to create a new statement in the deposit type", async () => {
    const user: ICreateUserDTO = {
      name: "User",
      email: "test@testuser.com",
      password: "123456"
    };

    await createUserUseCase.execute(user);

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    const statement: ICreateStatementDTO = {
      user_id: result.user.id,
      description: "test",
      amount: 100.00,
      type: 'deposit' as OperationType,
    }

    const statementResult = await createStatementUseCase.execute(statement);
    expect(statementResult).toHaveProperty("id");
    expect(statementResult.type).toBe('deposit');
  });

  it("Should be able to create a new statement in the withdraw type", async () => {
    const user: ICreateUserDTO = {
      name: "User 2",
      email: "test@testuser2.com",
      password: "123456"
    };

    await createUserUseCase.execute(user);

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    const statementDeposit: ICreateStatementDTO = {
      user_id: result.user.id,
      description: "test",
      amount: 100.00,
      type: 'deposit' as OperationType,
    };

    const statementWithdraw: ICreateStatementDTO = {
      user_id: result.user.id,
      description: "test",
      amount: 50.00,
      type: 'withdraw' as OperationType,
    };

    await createStatementUseCase.execute(statementDeposit);

    const statementResult = await createStatementUseCase.execute(statementWithdraw);
    expect(statementResult).toHaveProperty("id");
    expect(statementResult.type).toBe('withdraw');
  });

  it("Should not be able to create a statement if user not exists", async () => {
    expect(async () => {
      const statement: ICreateStatementDTO = {
        user_id: '123455',
        description: "test",
        amount: 50.00,
        type: 'deposit' as OperationType,
      };
  
      await createStatementUseCase.execute(statement);
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should not be able to create a new statement in withdraw type if you don't have enough funds",
    async () => {
      expect(async () => {
        const user: ICreateUserDTO = {
          name: "User 2",
          email: "test@testuser2.com",
          password: "123456"
        };
    
        await createUserUseCase.execute(user);
    
        const result = await authenticateUserUseCase.execute({
          email: user.email,
          password: user.password,
        });
    
        const statementWithdraw: ICreateStatementDTO = {
          user_id: result.user.id,
          description: "test",
          amount: 50.00,
          type: 'withdraw' as OperationType,
        };
    
        await createStatementUseCase.execute(statementWithdraw);
      }).rejects.toBeInstanceOf(AppError);
    });
});
