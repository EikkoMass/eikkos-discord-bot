import { GlideClient, TimeUnit } from "@valkey/valkey-glide";
import dotenv from "dotenv";

async function newClient() {
  return await GlideClient.createClient({
    addresses: [
      {
        host: process.env.VALKEY_HOST,
        port: Number.parseInt(process.env.VALKEY_PORT),
      },
    ],
  });
}

async function connect() {
  const client = await newClient();
  let res = { success: false, error: null };
  try {
    await client.ping();
    res.success = true;
  } catch (error) {
    res.error = error.message;
  } finally {
    client.close();
  }

  return res;
}

async function get(key) {
  const client = await newClient();
  let value = null;

  try {
    value = await client.get(key);
  } catch (error) {
    console.log(error);
    console.error(`Failed to get key: ${key}`);
  } finally {
    client.close();
  }

  return value;
}

async function remove(key) {
  const client = await newClient();
  let count = 0;

  try {
    await client.del([key]);
  } catch (error) {
    console.error(`Failed to delete key: ${key}`);
  } finally {
    client.close();
  }

  return count > 0;
}

async function exists(key) {
  const client = await newClient();
  let count = 0;

  try {
    console.log(client.exists);
    count = await client.exists([key]);
  } catch (error) {
    console.log(error);
    console.error(`Failed to find key: ${key}`);
  } finally {
    client;
    client.close();
  }

  return count > 0;
}

async function set(key, value, ttl) {
  const client = await newClient();
  try {
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
    remove,
    exists,
    connect,
  },
  newClient,
};
