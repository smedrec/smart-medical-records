import { MongoDBStore, MongoDBVector } from '@mastra/mongodb'

export const mongoStorage = new MongoDBStore({
	url: process.env.MONGO_DB_URL!,
	dbName: 'mastra',
})

export const mongoVector = new MongoDBVector({
	uri: process.env.MONGO_DB_URL!,
	dbName: process.env.MONGO_DB_VECTOR_DB!,
})
