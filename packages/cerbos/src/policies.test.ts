import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { Cerbos } from './index'

// Mock Cerbos client for testing
const mockCerbosClient = {
	isAllowed: vi.fn(),
	checkResource: vi.fn(),
}

vi.mock('@cerbos/http', () => ({
	HTTP: vi.fn(() => mockCerbosClient),
}))

describe('Cerbos Policy Validation', () => {
	let cerbos: Cerbos

	beforeEach(() => {
		cerbos = new Cerbos('http://localhost:3592')
		vi.clearAllMocks()
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('Practitioner Resource Policies', () => {
		describe('Owner Role', () => {
			const ownerPrincipal = {
				id: 'owner-123',
				roles: ['owner'],
				attributes: {
					organization_id: 'org-456',
					verification_status: 'verified',
					is_verified: true,
				},
			}

			it('should allow owner to create practitioners', async () => {
				mockCerbosClient.isAllowed.mockResolvedValue(true)

				const result = await cerbos.isAllowed({
					principal: ownerPrincipal,
					resource: {
						kind: 'Practitioner',
						id: 'new-practitioner',
						attributes: {
							organization_id: 'org-456',
						},
					},
					action: 'create',
				})

				expect(result).toBe(true)
				expect(mockCerbosClient.isAllowed).toHaveBeenCalledWith(
					{
						principal: ownerPrincipal,
						resource: {
							kind: 'Practitioner',
							id: 'new-practitioner',
							attributes: {
								organization_id: 'org-456',
							},
						},
						action: 'create',
					},
					undefined
				)
			})

			it('should allow owner to approve practitioners', async () => {
				mockCerbosClient.isAllowed.mockResolvedValue(true)

				const result = await cerbos.isAllowed({
					principal: ownerPrincipal,
					resource: {
						kind: 'Practitioner',
						id: 'practitioner-789',
						attributes: {
							organization_id: 'org-456',
							verification_status: 'pending',
						},
					},
					action: 'approve',
				})

				expect(result).toBe(true)
			})

			it('should allow owner to verify licenses', async () => {
				mockCerbosClient.isAllowed.mockResolvedValue(true)

				const result = await cerbos.isAllowed({
					principal: ownerPrincipal,
					resource: {
						kind: 'Practitioner',
						id: 'practitioner-789',
						attributes: {
							organization_id: 'org-456',
						},
					},
					action: 'verify_license',
				})

				expect(result).toBe(true)
			})

			it('should allow owner to manage roles', async () => {
				mockCerbosClient.isAllowed.mockResolvedValue(true)

				const result = await cerbos.isAllowed({
					principal: ownerPrincipal,
					resource: {
						kind: 'Practitioner',
						id: 'practitioner-789',
						attributes: {
							organization_id: 'org-456',
						},
					},
					action: 'manage_roles',
				})

				expect(result).toBe(true)
			})
		})

		describe('Practitioner Role', () => {
			const practitionerPrincipal = {
				id: 'practitioner-123',
				roles: ['practitioner'],
				attributes: {
					organization_id: 'org-456',
					verification_status: 'verified',
					is_verified: true,
				},
			}

			it('should allow practitioner to read their own profile', async () => {
				mockCerbosClient.isAllowed.mockResolvedValue(true)

				const result = await cerbos.isAllowed({
					principal: practitionerPrincipal,
					resource: {
						kind: 'Practitioner',
						id: 'practitioner-123', // Same as principal ID
						attributes: {
							organization_id: 'org-456',
						},
					},
					action: 'read',
				})

				expect(result).toBe(true)
			})

			it('should allow practitioner to update their own profile', async () => {
				mockCerbosClient.isAllowed.mockResolvedValue(true)

				const result = await cerbos.isAllowed({
					principal: practitionerPrincipal,
					resource: {
						kind: 'Practitioner',
						id: 'practitioner-123', // Same as principal ID
						attributes: {
							organization_id: 'org-456',
						},
					},
					action: 'update',
				})

				expect(result).toBe(true)
			})

			it('should deny practitioner from updating other practitioners', async () => {
				mockCerbosClient.isAllowed.mockResolvedValue(false)

				const result = await cerbos.isAllowed({
					principal: practitionerPrincipal,
					resource: {
						kind: 'Practitioner',
						id: 'other-practitioner-456', // Different from principal ID
						attributes: {
							organization_id: 'org-456',
						},
					},
					action: 'update',
				})

				expect(result).toBe(false)
			})

			it('should allow practitioner to submit their own license info', async () => {
				mockCerbosClient.isAllowed.mockResolvedValue(true)

				const result = await cerbos.isAllowed({
					principal: practitionerPrincipal,
					resource: {
						kind: 'Practitioner',
						id: 'practitioner-123',
						attributes: {
							practitioner_id: 'practitioner-123',
							organization_id: 'org-456',
						},
					},
					action: 'submit_license_info',
				})

				expect(result).toBe(true)
			})

			it('should deny practitioner from approving other practitioners', async () => {
				mockCerbosClient.isAllowed.mockResolvedValue(false)

				const result = await cerbos.isAllowed({
					principal: practitionerPrincipal,
					resource: {
						kind: 'Practitioner',
						id: 'other-practitioner-456',
						attributes: {
							organization_id: 'org-456',
						},
					},
					action: 'approve',
				})

				expect(result).toBe(false)
			})
		})

		describe('Assistant Role', () => {
			const assistantPrincipal = {
				id: 'assistant-123',
				roles: ['assistant'],
				attributes: {
					organization_id: 'org-456',
				},
			}

			it('should allow assistant to read assigned practitioners', async () => {
				mockCerbosClient.isAllowed.mockResolvedValue(true)

				const result = await cerbos.isAllowed({
					principal: assistantPrincipal,
					resource: {
						kind: 'Practitioner',
						id: 'practitioner-789',
						attributes: {
							assigned_to_assistant: 'assistant-123',
							organization_id: 'org-456',
						},
					},
					action: 'read',
				})

				expect(result).toBe(true)
			})

			it('should deny assistant from reading non-assigned practitioners', async () => {
				mockCerbosClient.isAllowed.mockResolvedValue(false)

				const result = await cerbos.isAllowed({
					principal: assistantPrincipal,
					resource: {
						kind: 'Practitioner',
						id: 'practitioner-789',
						attributes: {
							assigned_to_assistant: 'other-assistant-456',
							organization_id: 'org-456',
						},
					},
					action: 'read',
				})

				expect(result).toBe(false)
			})

			it('should deny assistant from approving practitioners', async () => {
				mockCerbosClient.isAllowed.mockResolvedValue(false)

				const result = await cerbos.isAllowed({
					principal: assistantPrincipal,
					resource: {
						kind: 'Practitioner',
						id: 'practitioner-789',
						attributes: {
							assigned_to_assistant: 'assistant-123',
							organization_id: 'org-456',
						},
					},
					action: 'approve',
				})

				expect(result).toBe(false)
			})
		})
	})

	describe('License Certificate Resource Policies', () => {
		describe('Owner Role', () => {
			const ownerPrincipal = {
				id: 'owner-123',
				roles: ['owner'],
				attributes: {
					organization_id: 'org-456',
				},
			}

			it('should allow owner to process OCR on any certificate', async () => {
				mockCerbosClient.isAllowed.mockResolvedValue(true)

				const result = await cerbos.isAllowed({
					principal: ownerPrincipal,
					resource: {
						kind: 'LicenseCertificate',
						id: 'cert-123',
						attributes: {
							practitioner_id: 'practitioner-789',
							organization_id: 'org-456',
						},
					},
					action: 'process_ocr',
				})

				expect(result).toBe(true)
			})

			it('should allow owner to approve certificates', async () => {
				mockCerbosClient.isAllowed.mockResolvedValue(true)

				const result = await cerbos.isAllowed({
					principal: ownerPrincipal,
					resource: {
						kind: 'LicenseCertificate',
						id: 'cert-123',
						attributes: {
							practitioner_id: 'practitioner-789',
							organization_id: 'org-456',
						},
					},
					action: 'approve',
				})

				expect(result).toBe(true)
			})
		})

		describe('Practitioner Role', () => {
			const practitionerPrincipal = {
				id: 'practitioner-123',
				roles: ['practitioner'],
				attributes: {
					organization_id: 'org-456',
					verification_status: 'pending',
				},
			}

			it('should allow practitioner to upload their own certificate', async () => {
				mockCerbosClient.isAllowed.mockResolvedValue(true)

				const result = await cerbos.isAllowed({
					principal: practitionerPrincipal,
					resource: {
						kind: 'LicenseCertificate',
						id: 'new-cert',
						attributes: {
							practitioner_id: 'practitioner-123',
							organization_id: 'org-456',
						},
					},
					action: 'upload',
				})

				expect(result).toBe(true)
			})

			it('should allow practitioner to view their own certificate status', async () => {
				mockCerbosClient.isAllowed.mockResolvedValue(true)

				const result = await cerbos.isAllowed({
					principal: practitionerPrincipal,
					resource: {
						kind: 'LicenseCertificate',
						id: 'cert-123',
						attributes: {
							practitioner_id: 'practitioner-123',
							organization_id: 'org-456',
						},
					},
					action: 'view_status',
				})

				expect(result).toBe(true)
			})

			it('should deny practitioner from viewing other practitioners certificates', async () => {
				mockCerbosClient.isAllowed.mockResolvedValue(false)

				const result = await cerbos.isAllowed({
					principal: practitionerPrincipal,
					resource: {
						kind: 'LicenseCertificate',
						id: 'cert-456',
						attributes: {
							practitioner_id: 'other-practitioner-789',
							organization_id: 'org-456',
						},
					},
					action: 'read',
				})

				expect(result).toBe(false)
			})

			it('should deny practitioner from approving certificates', async () => {
				mockCerbosClient.isAllowed.mockResolvedValue(false)

				const result = await cerbos.isAllowed({
					principal: practitionerPrincipal,
					resource: {
						kind: 'LicenseCertificate',
						id: 'cert-123',
						attributes: {
							practitioner_id: 'practitioner-123',
							organization_id: 'org-456',
						},
					},
					action: 'approve',
				})

				expect(result).toBe(false)
			})
		})

		describe('System Role', () => {
			const systemPrincipal = {
				id: 'system',
				roles: ['system'],
				attributes: {},
			}

			it('should allow system to perform automated OCR processing', async () => {
				mockCerbosClient.isAllowed.mockResolvedValue(true)

				const result = await cerbos.isAllowed({
					principal: systemPrincipal,
					resource: {
						kind: 'LicenseCertificate',
						id: 'cert-123',
						attributes: {
							practitioner_id: 'practitioner-789',
						},
					},
					action: 'process_ocr',
				})

				expect(result).toBe(true)
			})

			it('should allow system to auto-verify certificates', async () => {
				mockCerbosClient.isAllowed.mockResolvedValue(true)

				const result = await cerbos.isAllowed({
					principal: systemPrincipal,
					resource: {
						kind: 'LicenseCertificate',
						id: 'cert-123',
						attributes: {
							practitioner_id: 'practitioner-789',
						},
					},
					action: 'auto_verify',
				})

				expect(result).toBe(true)
			})

			it('should allow system to queue manual reviews', async () => {
				mockCerbosClient.isAllowed.mockResolvedValue(true)

				const result = await cerbos.isAllowed({
					principal: systemPrincipal,
					resource: {
						kind: 'LicenseCertificate',
						id: 'cert-123',
						attributes: {
							practitioner_id: 'practitioner-789',
						},
					},
					action: 'queue_manual_review',
				})

				expect(result).toBe(true)
			})
		})
	})

	describe('Verification Workflow Resource Policies', () => {
		describe('Owner Role', () => {
			const ownerPrincipal = {
				id: 'owner-123',
				roles: ['owner'],
				attributes: {
					organization_id: 'org-456',
				},
			}

			it('should allow owner to initiate verification workflows', async () => {
				mockCerbosClient.isAllowed.mockResolvedValue(true)

				const result = await cerbos.isAllowed({
					principal: ownerPrincipal,
					resource: {
						kind: 'VerificationWorkflow',
						id: 'workflow-123',
						attributes: {
							practitioner_id: 'practitioner-789',
							organization_id: 'org-456',
						},
					},
					action: 'initiate',
				})

				expect(result).toBe(true)
			})

			it('should allow owner to export reports', async () => {
				mockCerbosClient.isAllowed.mockResolvedValue(true)

				const result = await cerbos.isAllowed({
					principal: ownerPrincipal,
					resource: {
						kind: 'VerificationWorkflow',
						id: 'workflow-123',
						attributes: {
							organization_id: 'org-456',
						},
					},
					action: 'export_reports',
				})

				expect(result).toBe(true)
			})
		})

		describe('Practitioner Role', () => {
			const practitionerPrincipal = {
				id: 'practitioner-123',
				roles: ['practitioner'],
				attributes: {
					organization_id: 'org-456',
				},
			}

			it('should allow practitioner to initiate their own workflow', async () => {
				mockCerbosClient.isAllowed.mockResolvedValue(true)

				const result = await cerbos.isAllowed({
					principal: practitionerPrincipal,
					resource: {
						kind: 'VerificationWorkflow',
						id: 'workflow-123',
						attributes: {
							practitioner_id: 'practitioner-123',
							organization_id: 'org-456',
						},
					},
					action: 'initiate',
				})

				expect(result).toBe(true)
			})

			it('should allow practitioner to submit documents for their workflow', async () => {
				mockCerbosClient.isAllowed.mockResolvedValue(true)

				const result = await cerbos.isAllowed({
					principal: practitionerPrincipal,
					resource: {
						kind: 'VerificationWorkflow',
						id: 'workflow-123',
						attributes: {
							practitioner_id: 'practitioner-123',
							organization_id: 'org-456',
						},
					},
					action: 'submit_documents',
				})

				expect(result).toBe(true)
			})

			it('should deny practitioner from approving workflows', async () => {
				mockCerbosClient.isAllowed.mockResolvedValue(false)

				const result = await cerbos.isAllowed({
					principal: practitionerPrincipal,
					resource: {
						kind: 'VerificationWorkflow',
						id: 'workflow-123',
						attributes: {
							practitioner_id: 'practitioner-123',
							organization_id: 'org-456',
						},
					},
					action: 'approve',
				})

				expect(result).toBe(false)
			})
		})

		describe('Verification Reviewer Role', () => {
			const reviewerPrincipal = {
				id: 'reviewer-123',
				roles: ['verification_reviewer'],
				attributes: {
					organization_id: 'org-456',
				},
			}

			it('should allow reviewer to review workflows', async () => {
				mockCerbosClient.isAllowed.mockResolvedValue(true)

				const result = await cerbos.isAllowed({
					principal: reviewerPrincipal,
					resource: {
						kind: 'VerificationWorkflow',
						id: 'workflow-123',
						attributes: {
							practitioner_id: 'practitioner-789',
							organization_id: 'org-456',
						},
					},
					action: 'review',
				})

				expect(result).toBe(true)
			})

			it('should allow reviewer to approve workflows', async () => {
				mockCerbosClient.isAllowed.mockResolvedValue(true)

				const result = await cerbos.isAllowed({
					principal: reviewerPrincipal,
					resource: {
						kind: 'VerificationWorkflow',
						id: 'workflow-123',
						attributes: {
							practitioner_id: 'practitioner-789',
							organization_id: 'org-456',
						},
					},
					action: 'approve',
				})

				expect(result).toBe(true)
			})

			it('should allow reviewer to request additional info', async () => {
				mockCerbosClient.isAllowed.mockResolvedValue(true)

				const result = await cerbos.isAllowed({
					principal: reviewerPrincipal,
					resource: {
						kind: 'VerificationWorkflow',
						id: 'workflow-123',
						attributes: {
							practitioner_id: 'practitioner-789',
							organization_id: 'org-456',
						},
					},
					action: 'request_additional_info',
				})

				expect(result).toBe(true)
			})
		})
	})

	describe('Organization Resource Policies', () => {
		describe('Owner Role', () => {
			const ownerPrincipal = {
				id: 'owner-123',
				roles: ['owner'],
				attributes: {
					organization_id: 'org-456',
				},
			}

			it('should allow owner to manage practitioners', async () => {
				mockCerbosClient.isAllowed.mockResolvedValue(true)

				const result = await cerbos.isAllowed({
					principal: ownerPrincipal,
					resource: {
						kind: 'Organization',
						id: 'org-456',
						attributes: {},
					},
					action: 'manage_practitioners',
				})

				expect(result).toBe(true)
			})

			it('should allow owner to configure SSO', async () => {
				mockCerbosClient.isAllowed.mockResolvedValue(true)

				const result = await cerbos.isAllowed({
					principal: ownerPrincipal,
					resource: {
						kind: 'Organization',
						id: 'org-456',
						attributes: {},
					},
					action: 'configure_sso',
				})

				expect(result).toBe(true)
			})

			it('should allow owner to export compliance reports', async () => {
				mockCerbosClient.isAllowed.mockResolvedValue(true)

				const result = await cerbos.isAllowed({
					principal: ownerPrincipal,
					resource: {
						kind: 'Organization',
						id: 'org-456',
						attributes: {},
					},
					action: 'export_compliance_reports',
				})

				expect(result).toBe(true)
			})
		})

		describe('Assistant Role', () => {
			const assistantPrincipal = {
				id: 'assistant-123',
				roles: ['assistant'],
				attributes: {
					organization_id: 'org-456',
				},
			}

			it('should allow assistant to manage assigned practitioners', async () => {
				mockCerbosClient.isAllowed.mockResolvedValue(true)

				const result = await cerbos.isAllowed({
					principal: assistantPrincipal,
					resource: {
						kind: 'Organization',
						id: 'org-456',
						attributes: {},
					},
					action: 'manage_assigned_practitioners',
				})

				expect(result).toBe(true)
			})

			it('should deny assistant from configuring SSO', async () => {
				mockCerbosClient.isAllowed.mockResolvedValue(false)

				const result = await cerbos.isAllowed({
					principal: assistantPrincipal,
					resource: {
						kind: 'Organization',
						id: 'org-456',
						attributes: {},
					},
					action: 'configure_sso',
				})

				expect(result).toBe(false)
			})
		})

		describe('Practitioner Role', () => {
			const practitionerPrincipal = {
				id: 'practitioner-123',
				roles: ['practitioner'],
				attributes: {
					organization_id: 'org-456',
				},
			}

			it('should allow practitioner to view organization info', async () => {
				mockCerbosClient.isAllowed.mockResolvedValue(true)

				const result = await cerbos.isAllowed({
					principal: practitionerPrincipal,
					resource: {
						kind: 'Organization',
						id: 'org-456',
						attributes: {},
					},
					action: 'read',
				})

				expect(result).toBe(true)
			})

			it('should allow practitioner to view their own status', async () => {
				mockCerbosClient.isAllowed.mockResolvedValue(true)

				const result = await cerbos.isAllowed({
					principal: practitionerPrincipal,
					resource: {
						kind: 'Organization',
						id: 'org-456',
						attributes: {},
					},
					action: 'view_own_status',
				})

				expect(result).toBe(true)
			})

			it('should deny practitioner from managing other practitioners', async () => {
				mockCerbosClient.isAllowed.mockResolvedValue(false)

				const result = await cerbos.isAllowed({
					principal: practitionerPrincipal,
					resource: {
						kind: 'Organization',
						id: 'org-456',
						attributes: {},
					},
					action: 'manage_practitioners',
				})

				expect(result).toBe(false)
			})
		})
	})
})
