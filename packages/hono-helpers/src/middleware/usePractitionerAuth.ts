import { HTTPException } from 'hono/http-exception'

import type { MiddlewareHandler } from 'hono'
import type { Session } from '@repo/auth'
import type { Cerbos } from '@repo/cerbos'

export interface PractitionerAuthOptions {
	/**
	 * Resource type for Cerbos authorization
	 */
	resource: string
	/**
	 * Action to check permission for
	 */
	action: string
	/**
	 * Optional resource ID (can be dynamic from request params)
	 */
	resourceId?: string | ((c: any) => string)
	/**
	 * Optional resource attributes for fine-grained access control
	 */
	resourceAttributes?: Record<string, any> | ((c: any) => Record<string, any>)
	/**
	 * Whether to allow system role to bypass checks (default: true)
	 */
	allowSystem?: boolean
	/**
	 * Custom error message for authorization failures
	 */
	errorMessage?: string
}

/**
 * Middleware for practitioner-specific authorization using Cerbos policies
 *
 * This middleware:
 * 1. Checks if user is authenticated
 * 2. Validates practitioner verification status if applicable
 * 3. Performs Cerbos authorization check
 * 4. Adds practitioner context to request variables
 *
 * @param options Configuration options for authorization
 * @returns Hono middleware handler
 */
export function usePractitionerAuth(options: PractitionerAuthOptions): MiddlewareHandler {
	return async (c, next) => {
		const session = c.get('session') as Session | null
		const services = c.get('services')

		if (!session) {
			throw new HTTPException(401, {
				message: 'Authentication required',
			})
		}

		if (!services?.cerbos) {
			throw new HTTPException(500, {
				message: 'Authorization service not available',
			})
		}

		const cerbos = services.cerbos as Cerbos

		// Get resource ID and attributes
		const resourceId =
			typeof options.resourceId === 'function'
				? options.resourceId(c)
				: options.resourceId || 'default'

		const resourceAttributes =
			typeof options.resourceAttributes === 'function'
				? options.resourceAttributes(c)
				: options.resourceAttributes || {}

		// Add session context to resource attributes
		const contextualAttributes = {
			...resourceAttributes,
			organization_id: session.activeOrganizationId || '',
			practitioner_id: session.userId,
			verification_status: session.verificationStatus || 'pending',
			assigned_to_assistant: session.assignedAssistantId || null,
		}

		// Prepare principal for Cerbos
		const principal = {
			id: session.userId,
			roles: [session.activeOrganizationRole as string],
			attributes: {
				organization_id: session.activeOrganizationId || '',
				verification_status: session.verificationStatus || 'pending',
				is_verified: session.isVerified || false,
			},
		}

		// Check authorization with Cerbos
		try {
			const isAllowed = await cerbos.isAllowed({
				principal,
				resource: {
					kind: options.resource,
					id: resourceId,
					attributes: contextualAttributes,
				},
				action: options.action,
			})

			if (!isAllowed) {
				throw new HTTPException(403, {
					message:
						options.errorMessage ||
						`Insufficient permissions to ${options.action} ${options.resource}`,
				})
			}

			// Add practitioner context to request variables for downstream handlers
			c.set('practitionerContext', {
				isVerified: session.isVerified || false,
				verificationStatus: session.verificationStatus || 'pending',
				organizationRole: session.activeOrganizationRole || 'member',
				canManagePractitioners: ['owner', 'admin'].includes(
					session.activeOrganizationRole as string
				),
				canVerifyLicenses: ['owner', 'admin', 'verification_reviewer'].includes(
					session.activeOrganizationRole as string
				),
			})
		} catch (error) {
			if (error instanceof HTTPException) {
				throw error
			}

			console.error('Cerbos authorization error:', error)
			throw new HTTPException(500, {
				message: 'Authorization check failed',
			})
		}

		await next()
	}
}

/**
 * Middleware specifically for practitioner license verification operations
 */
export function useLicenseVerificationAuth(
	action: 'submit' | 'verify' | 'approve' | 'reject' | 'view'
): MiddlewareHandler {
	return usePractitionerAuth({
		resource: 'LicenseCertificate',
		action: action === 'submit' ? 'upload' : action,
		resourceId: (c) => c.req.param('practitionerId') || c.req.param('certificateId') || 'default',
		resourceAttributes: (c) => ({
			practitioner_id: c.req.param('practitionerId') || c.get('session')?.userId,
		}),
		errorMessage: `Insufficient permissions to ${action} license verification`,
	})
}

/**
 * Middleware for practitioner management operations (invite, approve, etc.)
 */
export function usePractitionerManagementAuth(
	action: 'invite' | 'approve' | 'reject' | 'manage_roles' | 'view'
): MiddlewareHandler {
	return usePractitionerAuth({
		resource: 'Practitioner',
		action,
		resourceId: (c) => c.req.param('practitionerId') || 'default',
		resourceAttributes: (c) => ({
			organization_id: c.get('session')?.activeOrganizationId,
		}),
		errorMessage: `Insufficient permissions to ${action} practitioners`,
	})
}

/**
 * Middleware for verification workflow operations
 */
export function useVerificationWorkflowAuth(
	action: 'initiate' | 'review' | 'approve' | 'reject' | 'view'
): MiddlewareHandler {
	return usePractitionerAuth({
		resource: 'VerificationWorkflow',
		action,
		resourceId: (c) => c.req.param('workflowId') || c.req.param('practitionerId') || 'default',
		resourceAttributes: (c) => ({
			practitioner_id: c.req.param('practitionerId') || c.get('session')?.userId,
			organization_id: c.get('session')?.activeOrganizationId,
		}),
		errorMessage: `Insufficient permissions to ${action} verification workflow`,
	})
}

/**
 * Type definitions for practitioner context added to Hono variables
 */
export interface PractitionerContext {
	isVerified: boolean
	verificationStatus: string
	organizationRole: string
	canManagePractitioners: boolean
	canVerifyLicenses: boolean
}

// Extend Hono variables type to include practitioner context
declare module 'hono' {
	interface ContextVariableMap {
		practitionerContext: PractitionerContext
	}
}
