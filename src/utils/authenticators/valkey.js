import { GlideClient, TimeUnit } from "@valkey/valkey-glide";
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
    await connect();

    const response = await client.ping();

    console.log(`Connected! Server responded: ${response}`);
  } catch (error) {
    console.error(`Connection failed: ${error.message}`);
  } finally {
    client.close();
  }
}

async function get(key) {
  try {
    await connect();

    const value = await client.get(key);
    return value;
  } catch (error) {
    console.error(`Failed to get key: ${key}`);
    return null;
  } finally {
    client.close();
  }
}

async function set(key, value, ttl) {
  try {
    await connect();

    if (ttl) {
      await client.set(key, value, {
        expiry: {
          type: ttl.type ?? TimeUnit.Seconds,
          count: ttl.count,
        },
      });
    } else {
      await client.set(key, value);
    }

    client.close();

    return true;
  } catch (error) {
    console.error(`Failed to set key: ${error}`);
    client.close();

    return false;
  }
}

export default {
  actions: {
    get,
    set,
    connect,
    ping,
  },
  client,
};
