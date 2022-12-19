import request from "supertest";

import { app } from "../../../../app";

import { v4 as uuidV4 } from "uuid";

import { hash } from "bcryptjs"

import { Connection } from "typeorm";

import createConnection from "../../../../database/index"

let connection: Connection;

describe("Get user data", () => {
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

  it("Should be able to create a new statement in the deposit type", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "user@test.com",
      password: "test",
    });

    const { token } = responseToken.body;

    const response = await request(app).post("/api/v1/statements/deposit").send({
      description: "test",
      amount: 100.00,
    }).set({
      Authorization: `Bearer ${token}`
    });

    expect(response.status).toBe(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: response.body.id,
        user_id: response.body.user_id,
        description: response.body.description,
        amount: response.body.amount,
        type: response.body.type,
        created_at: response.body.created_at,
        updated_at: response.body.updated_at,
      })
    );
  });

  it("Should be able to create a new statement in the withdraw type", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "user@test.com",
      password: "test",
    });

    const { token } = responseToken.body;

    const response = await request(app).post("/api/v1/statements/withdraw").send({
      description: "test",
      amount: 100.00,
    }).set({
      Authorization: `Bearer ${token}`
    });

    expect(response.status).toBe(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: response.body.id,
        user_id: response.body.user_id,
        description: response.body.description,
        amount: response.body.amount,
        type: response.body.type,
        created_at: response.body.created_at,
        updated_at: response.body.updated_at,
      })
    );
  });

  it("Should not be able to create a statement if user not authenticated", async () => {
    const response = await request(app).post("/api/v1/statements/deposit").send({
      description: "test",
      amount: 100.00,
    }).set({
      Authorization: `Bearer ${"65b253e6fe67fbc15b0b4d09bdeaabff"}`
    });

    expect(response.status).toBe(401);
  });

  it("Should not be able to create a new statement in withdraw type if you don't have enough funds", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "user@test.com",
      password: "test",
    });

    const { token } = responseToken.body;

    const response = await request(app).post("/api/v1/statements/withdraw").send({
      description: "test",
      amount: 100.00,
    }).set({
      Authorization: `Bearer ${token}`
    });

    expect(response.status).toBe(400);

    expect(response.body).toHaveProperty('message');
  });
});