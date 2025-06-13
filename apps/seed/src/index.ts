// seed.ts
import fs from 'node:fs'
import path from 'node:path'

import { db } from './database.js'
import {
	codesystem,
	implementationguide,
	list,
	namingsystem,
	structuredefinition,
	valueset,
} from './schema/r4.js'

const __dirname = path.resolve()

const dataDir = path.join(
	__dirname,
	'/home/jose/Documents/workspace/smedrec/fhir/hl7.terminology.r4/package'
)
const jsonPaths = fs
	.readdirSync('/home/jose/Documents/workspace/smedrec/fhir/hl7.terminology.r4/package')
	.filter((file) => file.endsWith('.json'))
	.map((file) =>
		path.join('/home/jose/Documents/workspace/smedrec/fhir/hl7.terminology.r4/package', file)
	)

const seedDatabase = async () => {
	for (const jsonPath of jsonPaths) {
		try {
			const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))

			console.log(`Reading data from ${jsonPath}:`)

			switch (data.resourceType) {
				case 'CodeSystem': {
					console.log(`Processing CodeSystem resource type for ${jsonPath}`)
					const result = await db
						.insert(codesystem)
						.values({
							createdBy: 'riOyVZyHEQrV2n6X3PY2ifhbFm8KDOgk',
							updatedBy: 'riOyVZyHEQrV2n6X3PY2ifhbFm8KDOgk',
							resource: data,
						})
						.returning()

					console.log(`Created ${result[0].id}`)
					break
				}
				case 'ValueSet': {
					console.log(`Processing ValueSet resource type for ${jsonPath}`)
					const result = await db
						.insert(valueset)
						.values({
							createdBy: 'riOyVZyHEQrV2n6X3PY2ifhbFm8KDOgk',
							updatedBy: 'riOyVZyHEQrV2n6X3PY2ifhbFm8KDOgk',
							resource: data,
						})
						.returning()
					console.log(`Created ${result[0].id}`)
					break
				}
				case 'ImplementationGuide': {
					console.log(`Processing ImplementationGuide resource type for ${jsonPath}`)
					const result = await db
						.insert(implementationguide)
						.values({
							organization: 'vcoCNrwmPJYmhtG7E9emxeFZ3voKIDNl',
							createdBy: 'riOyVZyHEQrV2n6X3PY2ifhbFm8KDOgk',
							updatedBy: 'riOyVZyHEQrV2n6X3PY2ifhbFm8KDOgk',
							resource: data,
						})
						.returning()
					console.log(`Created ${result[0].id}`)
					break
				}
				case 'List': {
					console.log(`Processing List resource type for ${jsonPath}`)
					const result = await db
						.insert(list)
						.values({
							createdBy: 'riOyVZyHEQrV2n6X3PY2ifhbFm8KDOgk',
							updatedBy: 'riOyVZyHEQrV2n6X3PY2ifhbFm8KDOgk',
							resource: data,
						})
						.returning()
					console.log(`Created ${result[0].id}`)
					break
				}
				case 'NamingSystem': {
					console.log(`Processing List resource type for ${jsonPath}`)
					const result = await db
						.insert(namingsystem)
						.values({
							createdBy: 'riOyVZyHEQrV2n6X3PY2ifhbFm8KDOgk',
							updatedBy: 'riOyVZyHEQrV2n6X3PY2ifhbFm8KDOgk',
							resource: data,
						})
						.returning()
					console.log(`Created ${result[0].id}`)
					break
				}
				case 'StructureDefinition': {
					console.log(`Processing List resource type for ${jsonPath}`)
					const result = await db
						.insert(structuredefinition)
						.values({
							createdBy: 'riOyVZyHEQrV2n6X3PY2ifhbFm8KDOgk',
							updatedBy: 'riOyVZyHEQrV2n6X3PY2ifhbFm8KDOgk',
							resource: data,
						})
						.returning()
					console.log(`Created ${result[0].id}`)
					break
				}
				default:
					console.log(`Unknown resource type ${data.resourceType} for ${jsonPath}`)
					continue
			}
		} catch (e) {
			console.error(`Error seeding database from ${jsonPath}:`, e)
		}
	}
}

seedDatabase()
	.catch((e) => console.error(e))
	.finally(async () => {
		console.log('Database seeding completed.')
		process.exit(0)
	})
