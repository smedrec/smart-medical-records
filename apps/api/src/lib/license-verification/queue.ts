import { createId } from '@paralleldrive/cuid2'

import { LicenseInfo } from './types.js'

import type { ManualVerificationRequest, VerificationHistory } from './types.js'

export class VerificationQueue {
	private manualQueue: Map<string, ManualVerificationRequest> = new Map()
	private history: Map<string, VerificationHistory[]> = new Map()

	async addManualReview(
		request: Omit<ManualVerificationRequest, 'id' | 'createdAt' | 'status'>
	): Promise<string> {
		const id = createId()
		const manualRequest: ManualVerificationRequest = {
			...request,
			id,
			createdAt: new Date(),
			status: 'pending',
		}

		this.manualQueue.set(id, manualRequest)

		// Add to history
		await this.addToHistory({
			id: createId(),
			practitionerId: request.practitionerId,
			attemptType: 'manual',
			status: 'pending',
			details: {
				reason: request.reason,
				priority: request.priority,
			},
			createdAt: new Date(),
		})

		return id
	}

	async getManualRequest(id: string): Promise<ManualVerificationRequest | null> {
		return this.manualQueue.get(id) || null
	}

	async updateManualRequest(
		id: string,
		updates: Partial<ManualVerificationRequest>
	): Promise<boolean> {
		const request = this.manualQueue.get(id)
		if (!request) {
			return false
		}

		const updatedRequest = { ...request, ...updates }
		this.manualQueue.set(id, updatedRequest)

		// Add to history
		await this.addToHistory({
			id: createId(),
			practitionerId: request.practitionerId,
			attemptType: 'manual',
			status: updatedRequest.status === 'completed' ? 'verified' : 'pending',
			details: {
				updates,
				assignedTo: updatedRequest.assignedTo,
			},
			createdAt: new Date(),
		})

		return true
	}

	async getPendingRequests(
		priority?: 'low' | 'medium' | 'high'
	): Promise<ManualVerificationRequest[]> {
		const pending = Array.from(this.manualQueue.values()).filter((req) => req.status === 'pending')

		if (priority) {
			return pending.filter((req) => req.priority === priority)
		}

		// Sort by priority and creation date
		return pending.sort((a, b) => {
			const priorityOrder = { high: 3, medium: 2, low: 1 }
			const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
			if (priorityDiff !== 0) return priorityDiff
			return a.createdAt.getTime() - b.createdAt.getTime()
		})
	}

	async getRequestsByPractitioner(practitionerId: string): Promise<ManualVerificationRequest[]> {
		return Array.from(this.manualQueue.values())
			.filter((req) => req.practitionerId === practitionerId)
			.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
	}

	async assignRequest(requestId: string, assignedTo: string): Promise<boolean> {
		const request = this.manualQueue.get(requestId)
		if (!request || request.status !== 'pending') {
			return false
		}

		request.assignedTo = assignedTo
		request.status = 'in_progress'
		this.manualQueue.set(requestId, request)

		await this.addToHistory({
			id: createId(),
			practitionerId: request.practitionerId,
			attemptType: 'manual',
			status: 'pending',
			details: {
				action: 'assigned',
				assignedTo,
			},
			createdAt: new Date(),
		})

		return true
	}

	async completeRequest(
		requestId: string,
		result: 'verified' | 'failed',
		details?: Record<string, any>
	): Promise<boolean> {
		const request = this.manualQueue.get(requestId)
		if (!request) {
			return false
		}

		request.status = 'completed'
		this.manualQueue.set(requestId, request)

		await this.addToHistory({
			id: createId(),
			practitionerId: request.practitionerId,
			attemptType: 'manual',
			status: result,
			details: {
				action: 'completed',
				result,
				...details,
			},
			createdAt: new Date(),
		})

		return true
	}

	async addToHistory(entry: VerificationHistory): Promise<void> {
		const practitionerHistory = this.history.get(entry.practitionerId) || []
		practitionerHistory.push(entry)
		this.history.set(entry.practitionerId, practitionerHistory)
	}

	async getHistory(practitionerId: string): Promise<VerificationHistory[]> {
		return this.history.get(practitionerId) || []
	}

	async getRecentHistory(
		practitionerId: string,
		limit: number = 10
	): Promise<VerificationHistory[]> {
		const history = this.history.get(practitionerId) || []
		return history.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, limit)
	}

	async getQueueStats(): Promise<{
		pending: number
		inProgress: number
		completed: number
		byPriority: Record<string, number>
	}> {
		const requests = Array.from(this.manualQueue.values())

		const stats = {
			pending: 0,
			inProgress: 0,
			completed: 0,
			byPriority: { low: 0, medium: 0, high: 0 },
		}

		for (const request of requests) {
			switch (request.status) {
				case 'pending':
					stats.pending++
					break
				case 'in_progress':
					stats.inProgress++
					break
				case 'completed':
					stats.completed++
					break
			}
			stats.byPriority[request.priority]++
		}

		return stats
	}

	async cleanupCompletedRequests(olderThanDays: number = 30): Promise<number> {
		const cutoffDate = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000)
		let cleaned = 0

		for (const [id, request] of this.manualQueue.entries()) {
			if (request.status === 'completed' && request.createdAt < cutoffDate) {
				this.manualQueue.delete(id)
				cleaned++
			}
		}

		return cleaned
	}

	// Batch operations for efficiency
	async addBulkManualReviews(
		requests: Array<Omit<ManualVerificationRequest, 'id' | 'createdAt' | 'status'>>
	): Promise<string[]> {
		const ids: string[] = []

		for (const request of requests) {
			const id = await this.addManualReview(request)
			ids.push(id)
		}

		return ids
	}

	async getRequestsByAssignee(assignedTo: string): Promise<ManualVerificationRequest[]> {
		return Array.from(this.manualQueue.values())
			.filter((req) => req.assignedTo === assignedTo)
			.sort((a, b) => {
				// Sort by priority first, then by creation date
				const priorityOrder = { high: 3, medium: 2, low: 1 }
				const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
				if (priorityDiff !== 0) return priorityDiff
				return a.createdAt.getTime() - b.createdAt.getTime()
			})
	}
}
