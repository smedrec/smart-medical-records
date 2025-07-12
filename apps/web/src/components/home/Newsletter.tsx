import { NewsletterSignup } from '@/components/home/newsletter-signup'
import { subscribe } from '@/lib/newsletter/subscribe'
import { useServerFn } from '@tanstack/react-start'

export const Newsletter = () => {
	const mutate = useServerFn(subscribe)
	const handleSubmit = async (email: string): Promise<boolean> => {
		// Handle form submission
		try {
			return await mutate({ email: email, list: 'main', metadata: [{ pathname: 'home' }] })
		} catch (error) {
			return false
		}
	}

	return (
		<section id="newsletter">
			<hr className="w-11/12 mx-auto" />

			<NewsletterSignup onSubmit={handleSubmit} />

			<hr className="w-11/12 mx-auto" />
		</section>
	)
}
