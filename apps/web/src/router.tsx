import { DefaultCatchBoundary } from '@/components/DefaultCatchBoundary'
import NotFoundError from '@/components/errors/not-found-error'
import { createRouter as createTanStackRouter } from '@tanstack/react-router'

import { routeTree } from './routeTree.gen'

export function createRouter() {
	const router = createTanStackRouter({
		routeTree,
		defaultPreload: 'intent',
		defaultErrorComponent: DefaultCatchBoundary,
		defaultNotFoundComponent: () => <NotFoundError />,
		scrollRestoration: true,
	})

	return router
}

declare module '@tanstack/react-router' {
	interface Register {
		router: ReturnType<typeof createRouter>
	}
}
