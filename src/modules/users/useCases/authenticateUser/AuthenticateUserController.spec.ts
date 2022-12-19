import request from "supertest";

import { app } from "../../../../app";

import { v4 as uuidV4 } from "uuid";

import { hash } from "bcryptjs"

import { Connection } from "typeorm";

import createConnection from "../../../../database/index"

let connection: Connection;

describe("Authenticate User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidV4();

    const password = await hash("test", 8);

    await connection.query(
      `INSERT INTO users (id, name, email, password, "created_at", "updated_at")
      values('${id}', 'users', 'user@test.com', '${password}', 'now()', 'now()')`
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to authenticated user", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "user@test.com",
      password: "test",
    });

    expect(response.body.user).toEqual(
      expect.objectContaining({
        id: response.body.user.id,
        name: response.body.user.name,
        email: response.body.user.email,
      })
    );

    expect(response.body).toHaveProperty('token');
  });

  it("Should not be able to authenticated user if incorrect e-mail or password", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "user@testerror.com",
      password: "test",
    });

    expect(response.status).toBe(401);
  });
});