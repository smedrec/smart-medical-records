import { GRPC as Cerbos } from '@cerbos/grpc'

export const cerbos = new Cerbos('joseantcordeiro.hopto.org:3593', {
	tls: false,
})
