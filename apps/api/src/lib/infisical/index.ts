//import { InfisicalSDK } from '@infisical/sdk'

import { InfisicalKmsClient } from '@repo/infisical-kms'

/**export const INFISICAL_PROJECT_ID = process.env.INFISICAL_PROJECT_ID!

const infisical = new InfisicalSDK({
	siteUrl: 'https://infisical.teachhowtofish.org/', // Optional, defaults to https://app.infisical.com
})

// Authenticate with Infisical
await infisical.auth().universalAuth.login({
	clientId: process.env.INFISICAL_CLIENT_ID!,
	clientSecret: process.env.INFISICAL_CLIENT_SECRET!,
})

export { infisical }*/

const kms = new InfisicalKmsClient({
	baseUrl: process.env.KMS_ENDPOINT!,
	keyId: process.env.KMS_KEY_ID!,
	accessToken: process.env.INFISICAL_ACCESS_TOKEN!,
})

export { kms }

/**const allSecrets = await client.secrets().listSecrets({
  environment: "dev", // stg, dev, prod, or custom environment slugs
  projectId: INFISICAL_PROJECT_ID
});

console.log("Fetched secrets", allSecrets)*/
