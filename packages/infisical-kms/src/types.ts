export interface InfisicalKmsClientConfig {
	baseUrl: string
	keyId: string
	accessToken: string
}

export interface EncryptResponse {
	ciphertext: string
}

export interface DecryptResponse {
	plaintext: string
}
