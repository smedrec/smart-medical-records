import 'dotenv/config'

import { InfisicalKmsClient } from '@repo/infisical-kms'

const kms = new InfisicalKmsClient({
	baseUrl: process.env.INFISICAL_URL!,
	keyId: process.env.KMS_KEY_ID!,
	accessToken: process.env.INFISICAL_ACCESS_TOKEN!,
})

export { kms }
