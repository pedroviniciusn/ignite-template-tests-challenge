import {
  InMemoryStatementsRepository,
} from '@modules/statements/repositories/in-memory/InMemoryStatementsRepository';

import {
  InMemoryUsersRepository,
} from '@modules/users/repositories/in-memory/InMemoryUsersRepository';

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
} from '../createStatement/CreateStatementUseCase';

import {
  ICreateStatementDTO,
} from '../createStatement/ICreateStatementDTO';

import {
  GetStatementOperationUseCase,
} from './GetStatementOperationUseCase';


let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase; 
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get statement specific", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository,
    );
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository,
    );
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
  });

  it("Should be able to get statement specific", async () => {
    const user: ICreateUserDTO = {
      name: "User 1",
      email: "test@statement.com",
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

    const statement = await createStatementUseCase.execute(statementDeposit);

    const userStatement = await getStatementOperationUseCase.execute({
      user_id: statement.user_id,
      statement_id: statement.id,
    });

    expect(statement.id).toEqual(userStatement.id);
    expect(statement.user_id).toEqual(userStatement.user_id);
  });

  it("Should not be able to get statement specific, if user not found", async () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: "1289379831",
        statement_id: "19273812938",
      });
    }).rejects.toBeInstanceOf(AppError)
  });

  it("Should not be able to get statement specific, if statement not found", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "User 2",
        email: "test@statement2.com",
        password: "123456"
      };
  
      await createUserUseCase.execute(user);
  
      const userResult = await authenticateUserUseCase.execute({
        email: user.email,
        password: user.password,
      });
  
      await getStatementOperationUseCase.execute({
        user_id: userResult.user.id,
        statement_id: '121346378',
      });
    }).rejects.toBeInstanceOf(AppError);
  });
})