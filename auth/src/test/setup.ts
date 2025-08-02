import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";

let mongoServer: any;
beforeAll(async () => {
  process.env["jwt_secret"] = "ansh"; // Set
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  // Clear the database before each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});
afterAll(async () => {
  // Close the database connection after all tests
  mongoServer.stop();
  await mongoose.connection.close();
});
