// src/config/queue.ts

import Bull from "bull";
import { redisConfig } from ".";

export const queueOptions = {
    redis: redisConfig,
    defaultJobOptions: {
        removeOnComplete: false,
        removeOnFail: false
    }
};

export const QUEUE_NAME = "email-queue";

export const emailQueue = new Bull(QUEUE_NAME, queueOptions);