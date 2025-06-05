import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";
import { weatherWorkflow } from "./workflows/weather-workflow";
import { weatherAgent } from "./agents/weather-agent";
import { CloudflareDeployer } from "@mastra/deployer-cloudflare";
//import { D1Store } from "@mastra/cloudflare-d1";
//import type { D1Database } from "@cloudflare/workers-types";
import { MongoDBStore } from "@mastra/mongodb";

//type Env = {
  // Add your bindings here, e.g. Workers KV, D1, Workers AI, etc.
  //DB: D1Database;
//};

export const mastra = new Mastra({
  deployer: new CloudflareDeployer({
    scope: "your-account-id",
    projectName: "smedrec-ai-worker",
    routes: [
      {
        pattern: "example.com/*",
        zone_name: "example.com",
        custom_domain: true,
      },
    ],
    workerNamespace: "smedrec-ai-worker",
    auth: {
      apiToken: "your-api-token",
      apiEmail: "your-email",
    },
    d1Databases: [
      {
        binding: "DB",
        database_name: "smedrec-ai",
        database_id: "database-id",
      },
    ],
    kvNamespaces: [
      {
        binding: "KV",
        id: "namespace-id",
      },
    ],
  }),
  workflows: { weatherWorkflow },
  agents: { weatherAgent },
  //storage: new D1Store({
  //  binding: DB, // D1Database binding provided by the Workers runtime
  //  tablePrefix: "dev_", // Optional: isolate tables per environment
  //}),
  storage: new MongoDBStore({
    url: process.env.MONGO_DB_URL!,
    dbName: "mastra",
  }),
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
});
