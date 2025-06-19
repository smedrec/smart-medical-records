import { NewsletterSignup } from '@/components/home/newsletter-signuo'

import { Button } from '@repo/ui/components/ui/button'
import { Input } from '@repo/ui/components/ui/input'

export const Newsletter = () => {
	const handleSubmit = async (email: string) => {
		// Handle form submission

		// await submitToAPI(email);

		console.log('hello')
	}

	return (
		<section id="newsletter">
			<hr className="w-11/12 mx-auto" />

			<NewsletterSignup onSubmit={handleSubmit} />

			<hr className="w-11/12 mx-auto" />
		</section>
	)
}
