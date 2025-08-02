import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("has a route handler listening to /api/tickets for post requests", async () => {
  const response = await request(app).post("/api/tickets").send({});

  expect(response.status).not.toEqual(404);
});

it("can only be accessed if the user is signed in", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "Valid Title",
      price: 20,
      userId: new mongoose.Types.ObjectId(),
    });
  expect(response.status).toEqual(201);
});

it("returns an error if an invalid title is provided", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "",
      price: 20,
    });
  expect(response.status).toEqual(422);
});

it("returns an error if an invalid price is provided", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "Valid Title",
      price: -10,
    });
  expect(response.status).toEqual(422);
});
