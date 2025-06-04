/**
 * App Client.
 *
 * @app-client
 *
 * Use from other apps/packages:
 *
 * ```ts
 * import { AppClient } from '@repo/app-client'
 *
 * const client = new appClient({})
 * ```
 */
import { BaseResource } from './base'

import type {
	Assistant,
	ClientOptions,
	CreateAssistantParams,
	CreatePatientParams,
	CreateTherapistParams,
	DeleteObjectResponse,
	FindOneAssistantResponse,
	FindOneTherapistResponse,
	GetAllAssistantResponse,
	GetAllPatientResponse,
	GetAllTherapistResponse,
	PaginationParams,
	Patient,
	PatientToTherapist,
	PatientToTherapistParams,
	Therapist,
	UpdateAssistantParams,
	UpdatePatientParams,
	UpdateTherapistParams,
} from './types'

export class AppClient extends BaseResource {
	constructor(options: ClientOptions) {
		super(options)
	}

	/**
	 * Check if the API is working
	 * @returns Promise ...
	 */
	public ok(): Promise<{ ok: boolean }> {
		return this.request(`/auth/ok`)
	}

	/**
	 * Retrieves all available assistants
	 * @returns Promise containing map of assistants IDs to agent details
	 */
	public getAssistants(params: PaginationParams): Promise<Record<string, GetAllAssistantResponse>> {
		return this.request(`/assistant?limit=${params.limit}&page=${params.page}`)
	}

	/**
	 * Gets an assistant by ID
	 * @param assistantId - ID of the assistant to retrieve
	 * @returns Assistant and User associated
	 */
	public findOneAssistant(assistantId: string): Promise<Record<string, FindOneAssistantResponse>> {
		return this.request(`/assistant/${assistantId}`)
	}

	/**
	 * Creates a new assistant
	 * @param params - Parameters for creating the assistant
	 * @returns Promise containing the created assistant
	 */
	public createAssistant(params: CreateAssistantParams): Promise<Assistant> {
		return this.request(`/assistant`, { method: 'POST', body: params })
	}

	/**
	 * Updates a existing assistant
	 * @param assistantId - ID of the assistant to update
	 * @param params - Parameters for updating the assistant
	 * @returns Promise containing the updated assistant
	 */
	public updateAssistant(assistantId: string, params: UpdateAssistantParams): Promise<Assistant> {
		return this.request(`/assistant/${assistantId}`, { method: 'POST', body: params })
	}

	/**
	 * Deletes a existing assistant
	 * @param assistantId - ID of the assistant to delete
	 * @returns Promise containing the updated assistant
	 */
	public deleteAssistant(assistantId: string): Promise<DeleteObjectResponse> {
		return this.request(`/assistant/${assistantId}`, { method: 'DELETE' })
	}

	/**
	 * Retrieves all available therapists
	 * @returns Promise containing map of therapists IDs to therapist details
	 */
	public getTherapists(params: PaginationParams): Promise<Record<string, GetAllTherapistResponse>> {
		return this.request(`/therapist?limit=${params.limit}&page=${params.page}`)
	}

	/**
	 * Gets an therapist by ID
	 * @param therapistId - ID of the therapist to retrieve
	 * @returns Therapist and User associated
	 */
	public findOneTherapist(therapistId: string): Promise<Record<string, FindOneTherapistResponse>> {
		return this.request(`/therapist/${therapistId}`)
	}

	/**
	 * Creates a new therapist
	 * @param params - Parameters for creating the therapist
	 * @returns Promise containing the created therapist
	 */
	public createTherapist(params: CreateTherapistParams): Promise<Therapist> {
		return this.request(`/therapist`, { method: 'POST', body: params })
	}

	/**
	 * Updates a existing therapist
	 * @param therapistId - ID of the therapist to update
	 * @param params - Parameters for updating the therapist
	 * @returns Promise containing the updated therapist
	 */
	public updateTherapist(therapistId: string, params: UpdateTherapistParams): Promise<Therapist> {
		return this.request(`/therapist/${therapistId}`, { method: 'POST', body: params })
	}

	/**
	 * Deletes a existing therapist
	 * @param therapistId - ID of the therapist to delete
	 * @returns Promise containing the updated therapist
	 */
	public deleteTherapist(therapistId: string): Promise<DeleteObjectResponse> {
		return this.request(`/therapist/${therapistId}`, { method: 'DELETE' })
	}

	/**
	 * Retrieves all available patients
	 * @returns Promise containing map of patients IDs to patient details
	 */
	public getPatients(params: PaginationParams): Promise<Record<string, GetAllPatientResponse>> {
		return this.request(`/patient?limit=${params.limit}&page=${params.page}`)
	}

	/**
	 * Gets an therapist by ID
	 * @param therapistId - ID of the therapist to retrieve
	 * @returns Therapist and User associated
	 */
	public findOnePatient(patientId: string): Promise<Record<string, Patient>> {
		return this.request(`/patient/${patientId}`)
	}

	/**
	 * Creates a new patient
	 * @param params - Parameters for creating the patient
	 * @returns Promise containing the created patient
	 */
	public createPatient(params: CreatePatientParams): Promise<Patient> {
		return this.request(`/patient`, { method: 'POST', body: params })
	}

	/**
	 * Updates a existing patient
	 * @param patientId - ID of the patient to update
	 * @param params - Parameters for updating the patient
	 * @returns Promise containing the updated patient
	 */
	public updatePatient(patientId: string, params: UpdatePatientParams): Promise<Patient> {
		return this.request(`/patient/${patientId}`, { method: 'POST', body: params })
	}

	/**
	 * Deletes a existing patient
	 * @param patientId - ID of the patient to delete
	 * @returns Promise containing the deleted patient
	 */
	public deletePatient(patientId: string): Promise<DeleteObjectResponse> {
		return this.request(`/patient/${patientId}`, { method: 'DELETE' })
	}

	/**
	 * Add a therapist to a existing patient
	 * @param params - Parameters for adding a therapist to a existing patient
	 * @returns Promise containing the relation record
	 */
	public patientToTherapist(params: PatientToTherapistParams): Promise<PatientToTherapist> {
		return this.request(`/patient/add-therapist`, { method: 'POST', body: params })
	}

	/**
	 * Disable a therapist to a existing patient
	 * @param params - Parameters for disable a therapist from a existing patient
	 * @returns Promise containing the relation record
	 */
	public disablePatientToTherapist(params: PatientToTherapistParams): Promise<PatientToTherapist> {
		return this.request(`/patient/disable-therapist`, { method: 'POST', body: params })
	}
}
