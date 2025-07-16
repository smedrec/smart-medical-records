import { beforeEach, describe, expect, it } from 'vitest'

import { LicenseVerificationService } from './service.js'
import { LicenseInfo } from './types.js'

describe('LicenseVerificationService', () => {
	let service: LicenseVerificationService

	beforeEach(() => {
		service = new LicenseVerificationService()
	})

	describe('verifyLicense', () => {
		it('should verify a valid US license', async () => {
			const licenseInfo: LicenseInfo = {
				licenseNumber: 'MD123456',
				jurisdiction: 'US-CA',
				practitionerName: 'Dr. John Smith',
				licenseType: 'Medical Doctor',
				expiryDate: new Date('2025-12-31'),
			}

			const result = await service.verifyLicense(licenseInfo)

			expect(result).toBeDefined()
			expect(result.status).toBeOneOf(['verified', 'manual_review'])
			expect(result.timestamp).toBeInstanceOf(Date)
			expect(result.details).toBeDefined()
		})

		it('should handle unsupported jurisdiction', async () => {
			const licenseInfo: LicenseInfo = {
				licenseNumber: 'XYZ123',
				jurisdiction: 'UNSUPPORTED',
				practitionerName: 'Dr. Jane Doe',
				licenseType: 'Medical Doctor',
			}

			const result = await service.verifyLicense(licenseInfo)

			expect(result.status).toBe('manual_review')
			expect(result.details.provider).toBe('manual')
		})
	})

	describe('getLicenseStatus', () => {
		it('should return license status for supported jurisdiction', async () => {
			const status = await service.getLicenseStatus('MD123456', 'US-CA')

			expect(status).toBeDefined()
			expect(status?.isValid).toBe(true)
			expect(status?.lastUpdated).toBeInstanceOf(Date)
		})

		it('should return null for unsupported jurisdiction', async () => {
			const status = await service.getLicenseStatus('XYZ123', 'UNSUPPORTED')

			expect(status).toBeNull()
		})
	})

	describe('bulkVerify', () => {
		it('should verify multiple licenses', async () => {
			const licenses: LicenseInfo[] = [
				{
					licenseNumber: 'MD123456',
					jurisdiction: 'US-CA',
					practitionerName: 'Dr. John Smith',
					licenseType: 'Medical Doctor',
				},
				{
					licenseNumber: 'MD789012',
					jurisdiction: 'US-TX',
					practitionerName: 'Dr. Jane Doe',
					licenseType: 'Medical Doctor',
				},
			]

			const results = await service.bulkVerify(licenses)

			expect(results).toHaveLength(2)
			expect(results[0].timestamp).toBeInstanceOf(Date)
			expect(results[1].timestamp).toBeInstanceOf(Date)
		})
	})
})
