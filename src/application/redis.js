import IORedis from "ioredis";
import {redisHost, redisPort} from "../config/redis.config.js";
import {logger} from "./logging.js";

export const redisClient = new IORedis({
    host: redisHost, 
    port: redisPort,
    maxRetries: 5,
    // retryStrategy: 600
    retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
});

redisClient.on('error', (error) => {
    logger.error('Redis connection error:', error);
})