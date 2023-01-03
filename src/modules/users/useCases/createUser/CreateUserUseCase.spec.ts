import {
  AppError,
} from '@shared/errors/AppError';

import InMemoryUsersRepository from '../../repositories/in-memory/InMemoryUsersRepository';

import {
  CreateUserUseCase,
} from './CreateUserUseCase';

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase; 

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("Should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "User Test",
      email: "test@test.com",
      password: "123456"
    });

    expect(user).toHaveProperty("id");
  });

  it("Should not be able to create a new user if exists email for user registered", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "User Test",
        email: "test@test.com",
        password: "123456"
      });
  
      await createUserUseCase.execute({
        name: "User Test 2",
        email: "test@test.com",
        password: "01010101"
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});