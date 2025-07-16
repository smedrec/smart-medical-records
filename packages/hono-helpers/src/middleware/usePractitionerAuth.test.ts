import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
	useLicenseVerificationAuth,
	usePractitionerAuth,
	usePractitionerManagementAuth,
	useVerificationWorkflowAuth,
} from './usePractitionerAuth'

// Mock Cerbos
const mockCerbos = {
	isAllowed: vi.fn(),
}

// Mock session data
const mockSession = {
	userId: 'user-123',
	activeOrganizationId: 'org-456',
	activeOrganizationRole: 'practitioner',
	verificationStatus: 'verified',
	isVerified: true,
	assignedAssistantId: 'assistant-789',
}

const mockServices = {
	cerbos: mockCerbos,
}

describe('usePractitionerAuth', () => {
	let app: Hono

	beforeEach(() => {
		app = new Hono()
		vi.clearAllMocks()
	})

	describe('Basic Authentication and Authorization', () => {
		it('should throw 401 when no session is present', async () => {
			app.use(
				'/test',
				usePractitionerAuth({
					resource: 'Practitioner',
					action: 'read',
				})
			)
			app.get('/test', (c) => c.json({ success: true }))

			const mockContext = {
				get: vi.fn((key: string) => {
					if (key === 'session') return null
					if (key === 'services') return mockServices
					return undefined
				}),
				set: vi.fn(),
			}

			const mockNext = vi.fn()

			const middleware = usePractitionerAuth({
				resource: 'Practitioner',
				action: 'read',
			})

			await expect(middleware(mockContext as any, mockNext)).rejects.toThrow(HTTPException)
			expect(mockNext).not.toHaveBeenCalled()
		})

		it('should throw 500 when Cerbos service is not available', async () => {
			const mockContext = {
				get: vi.fn((key: string) => {
					if (key === 'session') return mockSession
					if (key === 'services') return {}
					return undefined
				}),
				set: vi.fn(),
			}

			const mockNext = vi.fn()

			const middleware = usePractitionerAuth({
				resource: 'Practitioner',
				action: 'read',
			})

			await expect(middleware(mockContext as any, mockNext)).rejects.toThrow(HTTPException)
			expect(mockNext).not.toHaveBeenCalled()
		})

		it('should throw 403 when Cerbos denies access', async () => {
			mockCerbos.isAllowed.mockResolvedValue(false)

			const mockContext = {
				get: vi.fn((key: string) => {
					if (key === 'session') return mockSession
					if (key === 'services') return mockServices
					return undefined
				}),
				set: vi.fn(),
			}

			const mockNext = vi.fn()

			const middleware = usePractitionerAuth({
				resource: 'Practitioner',
				action: 'read',
			})

			await expect(middleware(mockContext as any, mockNext)).rejects.toThrow(HTTPException)
			expect(mockCerbos.isAllowed).toHaveBeenCalledWith({
				principal: {
					id: 'user-123',
					roles: ['practitioner'],
					attributes: {
						organization_id: 'org-456',
						verification_status: 'verified',
						is_verified: true,
					},
				},
				resource: {
					kind: 'Practitioner',
					id: 'default',
					attributes: {
						organization_id: 'org-456',
						practitioner_id: 'user-123',
						verification_status: 'verified',
						assigned_to_assistant: 'assistant-789',
					},
				},
				action: 'read',
			})
			expect(mockNext).not.toHaveBeenCalled()
		})

		it('should proceed when Cerbos allows access', async () => {
			mockCerbos.isAllowed.mockResolvedValue(true)

			const mockContext = {
				get: vi.fn((key: string) => {
					if (key === 'session') return mockSession
					if (key === 'services') return mockServices
					return undefined
				}),
				set: vi.fn(),
			}

			const mockNext = vi.fn()

			const middleware = usePractitionerAuth({
				resource: 'Practitioner',
				action: 'read',
			})

			await middleware(mockContext as any, mockNext)

			expect(mockCerbos.isAllowed).toHaveBeenCalled()
			expect(mockContext.set).toHaveBeenCalledWith('practitionerContext', {
				isVerified: true,
				verificationStatus: 'verified',
				organizationRole: 'practitioner',
				canManagePractitioners: false,
				canVerifyLicenses: false,
			})
			expect(mockNext).toHaveBeenCalled()
		})

		it('should set correct practitioner context for owner role', async () => {
			mockCerbos.isAllowed.mockResolvedValue(true)

			const ownerSession = {
				...mockSession,
				activeOrganizationRole: 'owner',
			}

			const mockContext = {
				get: vi.fn((key: string) => {
					if (key === 'session') return ownerSession
					if (key === 'services') return mockServices
					return undefined
				}),
				set: vi.fn(),
			}

			const mockNext = vi.fn()

			const middleware = usePractitionerAuth({
				resource: 'Practitioner',
				action: 'read',
			})

			await middleware(mockContext as any, mockNext)

			expect(mockContext.set).toHaveBeenCalledWith('practitionerContext', {
				isVerified: true,
				verificationStatus: 'verified',
				organizationRole: 'owner',
				canManagePractitioners: true,
				canVerifyLicenses: true,
			})
		})
	})

	describe('Dynamic Resource ID and Attributes', () => {
		it('should use function-based resource ID', async () => {
			mockCerbos.isAllowed.mockResolvedValue(true)

			const mockContext = {
				get: vi.fn((key: string) => {
					if (key === 'session') return mockSession
					if (key === 'services') return mockServices
					return undefined
				}),
				set: vi.fn(),
				req: {
					param: vi.fn((param: string) => {
						if (param === 'practitionerId') return 'practitioner-456'
						return undefined
					}),
				},
			}

			const mockNext = vi.fn()

			const middleware = usePractitionerAuth({
				resource: 'Practitioner',
				action: 'read',
				resourceId: (c) => c.req.param('practitionerId'),
			})

			await middleware(mockContext as any, mockNext)

			expect(mockCerbos.isAllowed).toHaveBeenCalledWith(
				expect.objectContaining({
					resource: expect.objectContaining({
						id: 'practitioner-456',
					}),
				})
			)
		})

		it('should use function-based resource attributes', async () => {
			mockCerbos.isAllowed.mockResolvedValue(true)

			const mockContext = {
				get: vi.fn((key: string) => {
					if (key === 'session') return mockSession
					if (key === 'services') return mockServices
					return undefined
				}),
				set: vi.fn(),
				req: {
					param: vi.fn((param: string) => {
						if (param === 'organizationId') return 'custom-org-123'
						return undefined
					}),
				},
			}

			const mockNext = vi.fn()

			const middleware = usePractitionerAuth({
				resource: 'Practitioner',
				action: 'read',
				resourceAttributes: (c) => ({
					custom_org_id: c.req.param('organizationId'),
				}),
			})

			await middleware(mockContext as any, mockNext)

			expect(mockCerbos.isAllowed).toHaveBeenCalledWith(
				expect.objectContaining({
					resource: expect.objectContaining({
						attributes: expect.objectContaining({
							custom_org_id: 'custom-org-123',
						}),
					}),
				})
			)
		})
	})

	describe('Error Handling', () => {
		it('should handle Cerbos errors gracefully', async () => {
			mockCerbos.isAllowed.mockRejectedValue(new Error('Cerbos connection failed'))

			const mockContext = {
				get: vi.fn((key: string) => {
					if (key === 'session') return mockSession
					if (key === 'services') return mockServices
					return undefined
				}),
				set: vi.fn(),
			}

			const mockNext = vi.fn()

			const middleware = usePractitionerAuth({
				resource: 'Practitioner',
				action: 'read',
			})

			await expect(middleware(mockContext as any, mockNext)).rejects.toThrow(HTTPException)
			expect(mockNext).not.toHaveBeenCalled()
		})

		it('should use custom error message when provided', async () => {
			mockCerbos.isAllowed.mockResolvedValue(false)

			const mockContext = {
				get: vi.fn((key: string) => {
					if (key === 'session') return mockSession
					if (key === 'services') return mockServices
					return undefined
				}),
				set: vi.fn(),
			}

			const mockNext = vi.fn()

			const customErrorMessage = 'Custom access denied message'
			const middleware = usePractitionerAuth({
				resource: 'Practitioner',
				action: 'read',
				errorMessage: customErrorMessage,
			})

			try {
				await middleware(mockContext as any, mockNext)
			} catch (error) {
				expect(error).toBeInstanceOf(HTTPException)
				expect((error as HTTPException).message).toBe(customErrorMessage)
			}
		})
	})
})

describe('Specialized Middleware Functions', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	describe('useLicenseVerificationAuth', () => {
		it('should configure correct resource and action for submit', async () => {
			mockCerbos.isAllowed.mockResolvedValue(true)

			const mockContext = {
				get: vi.fn((key: string) => {
					if (key === 'session') return mockSession
					if (key === 'services') return mockServices
					return undefined
				}),
				set: vi.fn(),
				req: {
					param: vi.fn((param: string) => {
						if (param === 'practitionerId') return 'practitioner-123'
						return undefined
					}),
				},
			}

			const mockNext = vi.fn()
			const middleware = useLicenseVerificationAuth('submit')

			await middleware(mockContext as any, mockNext)

			expect(mockCerbos.isAllowed).toHaveBeenCalledWith(
				expect.objectContaining({
					resource: expect.objectContaining({
						kind: 'LicenseCertificate',
					}),
					action: 'upload',
				})
			)
		})

		it('should configure correct resource and action for verify', async () => {
			mockCerbos.isAllowed.mockResolvedValue(true)

			const mockContext = {
				get: vi.fn((key: string) => {
					if (key === 'session') return mockSession
					if (key === 'services') return mockServices
					return undefined
				}),
				set: vi.fn(),
				req: {
					param: vi.fn(() => undefined),
				},
			}

			const mockNext = vi.fn()
			const middleware = useLicenseVerificationAuth('verify')

			await middleware(mockContext as any, mockNext)

			expect(mockCerbos.isAllowed).toHaveBeenCalledWith(
				expect.objectContaining({
					resource: expect.objectContaining({
						kind: 'LicenseCertificate',
					}),
					action: 'verify',
				})
			)
		})
	})

	describe('usePractitionerManagementAuth', () => {
		it('should configure correct resource for practitioner management', async () => {
			mockCerbos.isAllowed.mockResolvedValue(true)

			const mockContext = {
				get: vi.fn((key: string) => {
					if (key === 'session') return mockSession
					if (key === 'services') return mockServices
					return undefined
				}),
				set: vi.fn(),
				req: {
					param: vi.fn(() => undefined),
				},
			}

			const mockNext = vi.fn()
			const middleware = usePractitionerManagementAuth('invite')

			await middleware(mockContext as any, mockNext)

			expect(mockCerbos.isAllowed).toHaveBeenCalledWith(
				expect.objectContaining({
					resource: expect.objectContaining({
						kind: 'Practitioner',
					}),
					action: 'invite',
				})
			)
		})
	})

	describe('useVerificationWorkflowAuth', () => {
		it('should configure correct resource for workflow operations', async () => {
			mockCerbos.isAllowed.mockResolvedValue(true)

			const mockContext = {
				get: vi.fn((key: string) => {
					if (key === 'session') return mockSession
					if (key === 'services') return mockServices
					return undefined
				}),
				set: vi.fn(),
				req: {
					param: vi.fn((param: string) => {
						if (param === 'workflowId') return 'workflow-456'
						return undefined
					}),
				},
			}

			const mockNext = vi.fn()
			const middleware = useVerificationWorkflowAuth('initiate')

			await middleware(mockContext as any, mockNext)

			expect(mockCerbos.isAllowed).toHaveBeenCalledWith(
				expect.objectContaining({
					resource: expect.objectContaining({
						kind: 'VerificationWorkflow',
						id: 'workflow-456',
					}),
					action: 'initiate',
				})
			)
		})
	})
})

describe('Session Context Handling', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('should handle session without verification status', async () => {
		mockCerbos.isAllowed.mockResolvedValue(true)

		const sessionWithoutVerification = {
			userId: 'user-123',
			activeOrganizationId: 'org-456',
			activeOrganizationRole: 'practitioner',
			// No verification status properties
		}

		const mockContext = {
			get: vi.fn((key: string) => {
				if (key === 'session') return sessionWithoutVerification
				if (key === 'services') return mockServices
				return undefined
			}),
			set: vi.fn(),
		}

		const mockNext = vi.fn()

		const middleware = usePractitionerAuth({
			resource: 'Practitioner',
			action: 'read',
		})

		await middleware(mockContext as any, mockNext)

		expect(mockCerbos.isAllowed).toHaveBeenCalledWith(
			expect.objectContaining({
				principal: expect.objectContaining({
					attributes: expect.objectContaining({
						verification_status: 'pending',
						is_verified: false,
					}),
				}),
				resource: expect.objectContaining({
					attributes: expect.objectContaining({
						verification_status: 'pending',
					}),
				}),
			})
		)

		expect(mockContext.set).toHaveBeenCalledWith('practitionerContext', {
			isVerified: false,
			verificationStatus: 'pending',
			organizationRole: 'practitioner',
			canManagePractitioners: false,
			canVerifyLicenses: false,
		})
	})

	it('should handle different verification statuses', async () => {
		mockCerbos.isAllowed.mockResolvedValue(true)

		const sessionWithFailedVerification = {
			userId: 'user-123',
			activeOrganizationId: 'org-456',
			activeOrganizationRole: 'practitioner',
			verificationStatus: 'failed',
			isVerified: false,
		}

		const mockContext = {
			get: vi.fn((key: string) => {
				if (key === 'session') return sessionWithFailedVerification
				if (key === 'services') return mockServices
				return undefined
			}),
			set: vi.fn(),
		}

		const mockNext = vi.fn()

		const middleware = usePractitionerAuth({
			resource: 'Practitioner',
			action: 'read',
		})

		await middleware(mockContext as any, mockNext)

		expect(mockContext.set).toHaveBeenCalledWith('practitionerContext', {
			isVerified: false,
			verificationStatus: 'failed',
			organizationRole: 'practitioner',
			canManagePractitioners: false,
			canVerifyLicenses: false,
		})
	})
})
