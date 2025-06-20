import { z } from 'zod'

import { fhir } from '@repo/fhir'

import { server } from '../index.js'

const ReadResourceParamsSchema = z.object({
	resourceType: z.string(),
	id: z.string(),
})

const CreateResourceParamsSchema = z.object({
	resourceType: z.string(),
	resource: z.unknown(),
})

// TypeScript type derived from the Zod schema for type safety
export type ReadResourceParams = z.infer<typeof ReadResourceParamsSchema>
export type CreateResourceParams = z.infer<typeof CreateResourceParamsSchema>

// Reads and validates the memory data from memory.json
export async function readResource(params: ReadResourceParams): Promise<unknown> {
	try {
		const {
			data, // only present if 2XX response
			error, // only present if 4XX or 5XX response
		} = await (fhir.GET as any)(`/${params.resourceType}/{id}`, {
			params: {
				path: { id: params.id },
			},
		})
		const jsonData = JSON.parse(data)
		return jsonData
	} catch (error) {
		console.error('Error calling the fhir api:', error)
		// For a demo, we throw; a real app might return a default or handle errors differently
		throw new Error(
			`Error calling the fhir api: ${error instanceof Error ? error.message : String(error)}`
		)
	}
}

// Validates and writes the given memory data to memory.json
export async function createResource(params: CreateResourceParams): Promise<any> {
	try {
		const {
			data, // only present if 2XX response
			error, // only present if 4XX or 5XX response
		} = await (fhir.POST as any)(`/${params.resourceType}`, {
			body: params.resource,
		})
		const jsonData = JSON.parse(data)
		return jsonData
	} catch (error) {
		console.error('Error calling the fhir api:', error)
		throw new Error(
			`Error calling the fhir api:: ${error instanceof Error ? error.message : String(error)}`
		)
	}
}

// Registers the 'fhir_read_resource' resource with the MCP server.
// This resource represents the fhir resource readed.
function registerFHIRReadResource() {
	const resourceName = 'fhir_read_resource'
	// A URI identifying this resource type. Clients might request specific URIs under this base.
	const resourceUriBase = `fhir://${resourceName}/`

	server.resource(
		resourceName,
		resourceUriBase,
		{
			// Metadata defining resource capabilities
			read: true, // Allows clients/tools to read the resource
			write: true, // Allows clients/tools to modify the resource (via tools)
		},
		async (uri: URL, extra: any) => {
			// Extract params from extra if present
			const params: ReadResourceParams = {
				resourceType: extra?.resourceType,
				id: extra?.id,
			}
			// Handler called when a client reads the resource
			// This demo ignores the specific URI path and always returns the single memory file.
			// A multi-user system might use the path to identify the user.
			try {
				const resource = await readResource(params)
				return {
					contents: [
						{
							uri: uri.toString(), // Echo the requested URI
							mimeType: 'application/json',
							text: JSON.stringify(resource), // Return data as a JSON string
						},
					],
				}
			} catch (error) {
				console.error(`Error handling resource request for ${uri}:`, error)
				throw error // Propagate error to the server framework
			}
		}
	)
}

// Registers the 'fhir_create_resource' resource with the MCP server.
// This resource represents the fhir resource created.
function registerFHIRCreateResource() {
	const resourceName = 'fhir_create_resource'
	// A URI identifying this resource type. Clients might request specific URIs under this base.
	const resourceUriBase = `fhir://${resourceName}/`

	server.resource(
		resourceName,
		resourceUriBase,
		{
			// Metadata defining resource capabilities
			read: true, // Allows clients/tools to read the resource
			write: true, // Allows clients/tools to modify the resource (via tools)
		},
		async (uri: URL, extra: any) => {
			// Extract params from extra if present
			const params: CreateResourceParams = {
				resourceType: extra?.resourceType,
				resource: extra?.resource,
			}
			try {
				const resource = await createResource(params)
				return {
					contents: [
						{
							uri: uri.toString(), // Echo the requested URI
							mimeType: 'application/json',
							text: JSON.stringify(resource), // Return data as a JSON string
						},
					],
				}
			} catch (error) {
				console.error(`Error handling resource request for ${uri}:`, error)
				throw error // Propagate error to the server framework
			}
		}
	)
}

// Function called by src/index.ts to register all resources for this server.
export function registerResources() {
	registerFHIRReadResource()
	registerFHIRCreateResource()
}
