import { Redis } from '@upstash/redis';

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error('Missing Upstash Redis credentials');
}

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Function to validate the Redis connection
export async function validateRedisConnection(): Promise<boolean> {
  try {
    await redis.ping();
    console.log('Successfully connected to Redis');
    return true;
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    return false;
  }
}
