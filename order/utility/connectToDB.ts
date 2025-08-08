import mongoose from "mongoose";
const DB_URL =
  "mongodb+srv://ansh:fLyCerZk7dTxxJy4@ansh-par.7oghc.mongodb.net/ticketing-orders?retryWrites=true&w=majority&appName=Ansh-Par";

export const connectToDB = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log("--Connected to DB--");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
