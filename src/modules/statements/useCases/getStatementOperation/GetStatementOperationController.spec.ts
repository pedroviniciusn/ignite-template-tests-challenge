import request from "supertest";

import { app } from "../../../../app";

import { v4 as uuidV4 } from "uuid";

import { hash } from "bcryptjs"

import { Connection } from "typeorm";

import createConnection from "../../../../database/index"

let connection: Connection;

describe("Get Statement specific", () => {
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
  
  it("Should be able to get statement specific", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "user@test.com",
      password: "test",
    });

    const { token } = responseToken.body;

    const statement = await request(app).post("/api/v1/statements/deposit").send({
      description: "test",
      amount: 100.00,
    }).set({
      Authorization: `Bearer ${token}`
    });

    const response = await request(app).get(`/api/v1/statements/${statement.body.id}`).set({
      Authorization: `Bearer ${token}`
    });

    expect(response.status).toBe(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: statement.body.id,
        user_id: statement.body.user_id,
        description: statement.body.description,
        amount: Number(statement.body.amount).toFixed(2),
        type: statement.body.type,
        created_at: statement.body.created_at,
        updated_at: statement.body.updated_at,
      })
    );
  });

  it("Should not be able to get specif statement if user not authenticated", async () => {
    const response = await request(app).get(`/api/v1/statements/981273987`).set({
      Authorization: `Bearer ${"65b253e6fe67fbc15b0b4d09bdeaabff"}`
    });

    expect(response.status).toBe(401);
  });
});
