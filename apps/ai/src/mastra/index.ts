import { Mastra } from '@mastra/core/mastra'
import { CloudflareDeployer } from '@mastra/deployer-cloudflare'
import { PinoLogger } from '@mastra/loggers'

import { chefAgent } from './agents/chef-agent'
//import { D1Store } from "@mastra/cloudflare-d1";
//import type { D1Database } from "@cloudflare/workers-types";

import { researchAgent } from './agents/research-agent'
import { weatherAgent } from './agents/weather-agent'
import { pgStorage, pgVector } from './stores/pgvector'
import { weatherWorkflow } from './workflows/weather-workflow'

//type Env = {
// Add your bindings here, e.g. Workers KV, D1, Workers AI, etc.
//DB: D1Database;
//};

export const mastra = new Mastra({
	deployer: new CloudflareDeployer({
		scope: 'your-account-id',
		projectName: 'smedrec-ai-worker',
		routes: [
			{
				pattern: 'example.com/*',
				zone_name: 'example.com',
				custom_domain: true,
			},
		],
		workerNamespace: 'smedrec-ai-worker',
		auth: {
			apiToken: 'your-api-token',
			apiEmail: 'your-email',
		},
		d1Databases: [
			{
				binding: 'DB',
				database_name: 'smedrec-ai',
				database_id: 'database-id',
			},
		],
		kvNamespaces: [
			{
				binding: 'KV',
				id: 'namespace-id',
			},
		],
	}),
	workflows: { weatherWorkflow },
	agents: { researchAgent, weatherAgent, chefAgent },
	vectors: { pgVector },
	//storage: new D1Store({
	//  binding: DB, // D1Database binding provided by the Workers runtime
	//  tablePrefix: "dev_", // Optional: isolate tables per environment
	//}),
	storage: pgStorage,
	logger: new PinoLogger({
		name: 'Mastra',
		level: 'info',
	}),
})
