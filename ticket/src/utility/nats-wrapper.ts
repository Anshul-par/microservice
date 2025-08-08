import nats, { Stan } from "node-nats-streaming";

export class NatsWrapper {
  private _instance: Stan;

  instance() {
    if (!this._instance) {
      throw new Error("NATS client is not connected");
    }

    return this._instance;
  }

  connect({
    clusterId,
    clientId,
    url,
  }: {
    clusterId: string;
    clientId: string;
    url: string;
  }) {
    const connect = nats.connect(clusterId, clientId, {
      url,
    });

    return new Promise<Stan>((resolve, reject) => {
      connect.on("connect", () => {
        console.log("Connected to NATS");
        this._instance = connect;

        connect.on("close", () => {
          console.log("NATS connection closed");
          process.exit();
        });

        resolve(this._instance);
      });

      connect.on("error", (err) => {
        console.error(`Error connecting to NATS: ${err}`);
        reject(err);
      });

      connect.on("close", () => {
        console.log("NATS connection closed");
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
