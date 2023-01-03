import InMemoryUsersRepository from '@modules/users/repositories/in-memory/InMemoryUsersRepository';

import {
  AppError,
} from '@shared/errors/AppError';

import {
  AuthenticateUserUseCase,
} from '../authenticateUser/AuthenticateUserUseCase';

import {
  CreateUserUseCase,
} from '../createUser/CreateUserUseCase';

import {
  ICreateUserDTO,
} from '../createUser/ICreateUserDTO';

import {
  ShowUserProfileUseCase,
} from './ShowUserProfileUseCase';


let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase; 
let authenticateUserUseCase: AuthenticateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Get user data", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  });

  it("Should be able to get data user", async () => {
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

    const userResult = await showUserProfileUseCase.execute(result.user.id);

    expect(userResult).toHaveProperty('id');
    expect(userResult).toHaveProperty('name');
    expect(userResult).toHaveProperty('email');
  });

  it('shoul not be able to get data an nonexistent user', () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: 'teste@teste.com',
        password: '123456',
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});