import request from "supertest";
import { app } from "../../app";

it("returns 201 on successful signup", async () => {
  return request(app)
    .post("/api/auth/sign-up")
    .send({
      email: "test@example.com",
      password: "password123",
    })
    .expect(201);
});

it("returns 422 on gibberish email", async () => {
  await request(app)
    .post("/api/auth/sign-up")
    .send({
      email: "test@;,",
      password: "password123",
    })
    .expect(422);
});

it("returns 400 on duplicate users", async () => {
  await request(app)
    .post("/api/auth/sign-up")
    .send({
      email: "test@example.com",
      password: "paaass",
    })
    .expect(201);

  await request(app)
    .post("/api/auth/sign-up")
    .send({
      email: "test@example.com",
      password: "paaass",
    })
    .expect(400);
});

it("get the cookie after successful signin", async () => {
  await request(app)
    .post("/api/auth/sign-up")
    .send({
      email: "test@test.com",
      password: "password123",
    })
    .expect(201);

  const response = await request(app)
    .post("/api/auth/sign-in")
    .send({
      email: "test@test.com",
      password: "password123",
    })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
