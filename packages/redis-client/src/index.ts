export {
	getSharedRedisConnection,
	closeSharedRedisConnection,
	getRedisConnectionStatus,
} from './connection.js'

// Export Redis and RedisOptions types for convenience if consumers need them
export type { Redis, RedisOptions } from 'ioredis'
