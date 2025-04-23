// src/services/redisService.ts
import { createClient } from "redis";
import { redisConfig } from "../config/index";


const REDIS_URL = process.env.REDIS_URL
const client = createClient({
    url: REDIS_URL
});

export async function connectRedis() {
    await client.connect();
    console.log("🔌 Connected to Redis");
    return client;
}

export async function disconnectRedis() {
    await client.quit();
    console.log("🔌 Disconnected from Redis");
}

export async function updateEmailStatus(jobId: string, data: Record<string, string>) {
    await client.hSet(`email:${jobId}`, data);
}

export async function getEmailStatus(jobId: string) {
    return await client.hGetAll(`email:${jobId}`);
}

export default client;