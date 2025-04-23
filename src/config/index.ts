

export const queueOptions = {
    redis: redisConfig,
    limit: {
        max: 1,
        duration: 500
    },
    // removeOnComplete: 1000, // keep last 1000 job saved 
    // removeOnFail: 1000,
}


