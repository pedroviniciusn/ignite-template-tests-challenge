import request from "supertest";

import { app } from "../../../../app";

import { Connection } from "typeorm";

import createConnection from "../../../../database/index"

let connection: Connection;

describe("Create User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to create a new user", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name:'User Test',
      email: "user@test.com",
      password: "test",
    });

    expect(response.status).toBe(201);
  });

  it("Should not be able to create a new user if email exists", async () => {
    await request(app).post("/api/v1/users").send({
      name:'User Test',
      email: "user@test.com",
      password: "test",
    });

    const response = await request(app).post("/api/v1/users").send({
      name:'Test',
      email: "user@test.com",
      password: "19e13",
    });

    expect(response.status).toBe(400);
  });
});