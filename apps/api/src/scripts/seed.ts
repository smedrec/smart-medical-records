// seed.ts
import fs from 'fs'
import path from 'path'

import {
	codesystem,
	db,
	implementationguide,
	list,
	namingsystem,
	structuredefinition,
	valueset,
} from '@repo/db'

const dataDir = path.join(
	__dirname,
	'/home/jose/Documents/workspace/smedrec/fhir/hl7.terminology.r4/package'
)
const jsonPaths = fs
	.readdirSync(dataDir)
	.filter((file) => file.endsWith('.json'))
	.map((file) => path.join(dataDir, file))

const seedDatabase = async () => {
	for (const jsonPath of jsonPaths) {
		try {
			const data = (await import(jsonPath)).default

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

			if (data.resourceType === 'CodeSystem') {
				console.log(`CodeSystem resource type for ${jsonPath}`)
				const codeSystem = await db
					.insert(codesystem)
					.values({
						createdBy: 'riOyVZyHEQrV2n6X3PY2ifhbFm8KDOgk',
						updatedBy: 'riOyVZyHEQrV2n6X3PY2ifhbFm8KDOgk',
						resource: data,
					})
					.returning()

				console.log(`Created ${codeSystem[0].id}`)
			} else if (data.resourceType !== 'ValueSet') {
				console.log(`ValueSet resource type for ${jsonPath}`)
				const valueSet = await db
					.insert(valueset)
					.values({
						createdBy: 'riOyVZyHEQrV2n6X3PY2ifhbFm8KDOgk',
						updatedBy: 'riOyVZyHEQrV2n6X3PY2ifhbFm8KDOgk',
						resource: data,
					})
					.returning()
				console.log(`Created ${valueSet[0].id}`)
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
