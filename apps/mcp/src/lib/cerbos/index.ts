import { HTTP } from '@cerbos/http'
import { env } from 'cloudflare:workers'

export const cerbos = new HTTP(env.CERBOS_HTTP_API_URL)
