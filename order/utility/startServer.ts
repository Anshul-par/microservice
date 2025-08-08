import { Application } from "express";
import { connectToDB } from "./connectToDB";
import { natsWrapper } from "./nats-wrapper";
import { TicketCreatedListener } from "../listener/ticketCreatedListener";

export const startServer = async (app: Application, port: number) => {
  try {
    await connectToDB();

    await natsWrapper.connect({
      clusterId: "nats-ticketing",
      clientId: "ordering-service",
      url: "http://nats-srv:4222",
    });

    natsWrapper.instance().on("close", () => {
      console.log("NATS connection closed");
      process.exit();
    });

    new TicketCreatedListener(natsWrapper.instance()).listen();

    app.listen(port, () => {
      console.log(
        `server started at port: ${port} with environment set as "${process.env.NODE_ENV}" \n`
      );
    });
  } catch (error) {
    console.log(error);
  }
};
