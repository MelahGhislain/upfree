import { Redis } from 'ioredis';
import { env } from './methods';

const redisUrl: string | undefined = env('REDIS_URL');

const redisClient = () => {
  if (redisUrl) {
    console.log('Redis connected');
    return redisUrl;
  }
  throw new Error('Redis connection failed');
};

export const redis = new Redis(redisClient());
