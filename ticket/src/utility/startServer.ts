import { Application } from "express";
import { connectToDB } from "./connectToDB";

export const startServer = async (app: Application, port: number) => {
  try {
    await connectToDB();

    app.listen(port, () => {
      console.log(
        `server started at port: ${port} with environment set as "${process.env.NODE_ENV}" \n`
      );
    });
  } catch (error) {
    console.log(error);
  }
};
