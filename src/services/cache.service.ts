import { RedisClient } from "bun";
import { redisConfig } from "../config/redis.config";

const client = new RedisClient(redisConfig.url);

const getKey = (key: string) => `${redisConfig.prefix}${key}`;

export const cacheService = {
	async get<T>(key: string): Promise<T | null> {
		const value = await client.get(getKey(key));
		return value ? (JSON.parse(value) as T) : null;
	},
	async set(key: string, value: unknown, ttl = 3600): Promise<void> {
		await client.set(getKey(key), JSON.stringify(value), "EX", ttl);
	},
	async del(key: string): Promise<void> {
		await client.del(getKey(key));
	},
	async increament(key: string): Promise<number> {
		return await client.incr(getKey(key));
	},
	async decreament(key: string): Promise<number> {
		return await client.decr(getKey(key));
	},
	async exists(key: string): Promise<boolean> {
		return await client.exists(getKey(key));
	},
	async ttl(key: string): Promise<number> {
		return await client.ttl(getKey(key));
	},
	async expire(key: string, ttl: number): Promise<number> {
		return await client.expire(getKey(key), ttl);
	},
	get client() {
		return client;
	},
};
