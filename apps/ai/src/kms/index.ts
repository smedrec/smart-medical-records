import { InfisicalKmsClient } from '@repo/infisical-kms'

let kmsInstance: InfisicalKmsClient | undefined = undefined

function initializeKms() {
	if (!kmsInstance) {
		kmsInstance = new InfisicalKmsClient({
			baseUrl: process.env.INFISICAL_URL!,
			keyId: process.env.KMS_KEY_ID!,
			accessToken: process.env.INFISICAL_ACCESS_TOKEN!,
		})
	}
	return kmsInstance
}

function getKmsInstance() {
	if (!kmsInstance) {
		throw new Error('KMS not initialized. Call initializeKms first.')
	}
	return kmsInstance
}

export { initializeKms, getKmsInstance }
