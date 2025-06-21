import { HTTP } from '@cerbos/http'

export const cerbos = new HTTP(process.env.CERBOS_HTTP_API_URL!)
