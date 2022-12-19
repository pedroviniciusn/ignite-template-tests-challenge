import request from "supertest";

import { app } from "../../../../app";

import { v4 as uuidV4 } from "uuid";

import { hash } from "bcryptjs"

import { Connection } from "typeorm";

import createConnection from "../../../../database/index"

let connection: Connection;

describe("Get All Statements", () => {
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
  
  it("Should be able to get all statements and balance", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "user@test.com",
      password: "test",
    });

    const { token } = responseToken.body;

    await request(app).post("/api/v1/statements/deposit").send({
      description: "test",
      amount: 100.00,
    }).set({
      Authorization: `Bearer ${token}`
    });

    const response = await request(app).get("/api/v1/statements/balance").set({
      Authorization: `Bearer ${token}`
    });

    expect(response.body.statement.length).toBe(1);
    expect(response.body.balance).toBe(100);
  });

  it("Should not be able to get all statements if user not authenticated", async () => {
    const response = await request(app).post("/api/v1/statements/deposit").set({
      Authorization: `Bearer ${"65b253e6fe67fbc15b0b4d09bdeaabff"}`
    });
    
    expect(response.status).toBe(401);
  });
});