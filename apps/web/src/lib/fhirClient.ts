import { env } from 'cloudflare:workers'
import createClient from 'openapi-react-query'

import { fhir } from '@repo/fhir'

export const $api = createClient(fhir)
