// src/services/cacheService.ts

import { redis } from '../config/redis.config.js';
import { IAuth } from '../controller/auth.controller.js';

type SafeUser = Omit<IAuth, 'password'>;

/**
 * Retrieves a user from the Redis cache
 * @param userId The ID of the user to retrieve
 * @returns The user object if found, null otherwise
 */
export async function getUserFromCache(userId: string): Promise<SafeUser | null> {
    try {
        const cachedUser = await redis.get(`user:${userId}`);
        if (cachedUser) {
            const user: SafeUser = JSON.parse(cachedUser as string);
            return user;
        }
        return null;
    } catch (error) {
        console.error(`Error getting user ${userId} from cache:`, error);
        return null;
    }
}

/**
 * Stores a user in the Redis cache
 * @param userId The ID of the user to store
 * @param user The user object to store
 */
export async function setUserToCache(userId: string, user: IAuth): Promise<void> {
    try {
        const safeUser: SafeUser = {
            username: user.username,
            email: user.email
        };
        await redis.set(`user:${userId}`, JSON.stringify(safeUser), { ex: 3600 }); // Cache for 1 hour
        console.log(`User ${userId} cached successfully`);
    } catch (error) {
        console.error(`Error caching user ${userId}:`, error);
    }
}
