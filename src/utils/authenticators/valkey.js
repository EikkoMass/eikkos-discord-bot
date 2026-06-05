import { GlideClient } from "@valkey/valkey-glide";
import dotenv from "dotenv";

let client;

async function connect() {
  client = await GlideClient.createClient({
    addresses: [
      {
        host: process.env.VALKEY_HOST,
        port: Number.parseInt(process.env.VALKEY_PORT),
      },
    ],
  });
}

async function ping() {
  try {
    if (!client) await connect();

    // Test the connection
    const response = await client.ping();

    // Valkey responds with PONG
    console.log(`Connected! Server responded: ${response}`);
  } catch (error) {
    console.error(`Connection failed: ${error.message}`);
  } finally {
    // Always close the client
    client.close();
  }
}

export default {
  actions: {
    connect,
    ping,
  },
  client,
};
