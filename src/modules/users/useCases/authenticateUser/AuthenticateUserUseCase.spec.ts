import { AppError } from '@shared/errors/AppError';

import {
  InMemoryUsersRepository,
} from '@modules/users/repositories/in-memory/InMemoryUsersRepository';

import {
  CreateUserUseCase,
} from '../createUser/CreateUserUseCase';

import {
  ICreateUserDTO,
} from '../createUser/ICreateUserDTO';

import {
  AuthenticateUserUseCase,
} from './AuthenticateUserUseCase';


let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase; 
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
  });

  it("Should be able to authenticate an user", async () => {
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

    expect(result).toHaveProperty('token');
  });

  it('shoul not be able to authenticate an nonexistent user', () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: 'teste@teste.com',
        password: '123456',
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should not be able to authenticate an user if incorrect password", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "User",
        email: "test@testuser.com",
        password: "123456"
      };
  
      await createUserUseCase.execute(user);
  
      await authenticateUserUseCase.execute({
        email: user.email,
        password: '123098',
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
