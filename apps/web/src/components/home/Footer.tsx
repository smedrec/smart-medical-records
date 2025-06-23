import { Link } from '@tanstack/react-router'

import { Icons } from '@repo/ui/components/icons'

export function Footer() {
	return (
		<footer className=" py-12 px-4 md:px-6 bg-background">
			<div className="container mx-auto">
				<div className="flex flex-col md:flex-row justify-between">
					<div className="mb-8 md:mb-0">
						<Link to="/" className="flex items-center gap-2">
							<Icons.logo className="icon-class w-8" />
							<h2 className="text-lg font-bold">SMEDREC</h2>
						</Link>

						<h1 className="dark:text-gray-300 mt-4">
							Build by{' '}
							<span className="dark:text-[#039ee4]">
								<a href="https://github.com/joseantcordeiro" target="_blank" rel="noreferrer">
									@joseantcordeiro
								</a>
							</span>
						</h1>

						<p className="text-sm dark:text-gray-400 mt-5">
							© {new Date().getFullYear()} José Cordeiro. All rights reserved.
						</p>
						<p className="text-sm dark:text-gray-400 mt-5">
							Licensed under the MIT License (MIT). See LICENSE in the repo root for license
							information.
						</p>
					</div>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
						<div>
							<h3 className="font-semibold mb-4">Pages</h3>
							<ul className="space-y-2">
								<li>
									<a
										href="#"
										className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
									>
										Docs
									</a>
								</li>
								<li>
									<a
										href="#features"
										className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
									>
										Features
									</a>
								</li>
								<li>
									<a
										href="#faq"
										className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
									>
										FAQ
									</a>
								</li>
								<li>
									<a
										href="#pricing"
										className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
									>
										Pricing
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
									>
										Blog
									</a>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="font-semibold mb-4">Socials</h3>
							<ul className="space-y-2">
								<li>
									<a
										href="https://github.com/smedrec/smart-medical-record"
										className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
										target="_blank"
										rel="noreferrer"
									>
										Github
									</a>
								</li>
								<li>
									<a
										href="https://www.linkedin.com/in/joseantcordeiro"
										className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
										target="_blank"
										rel="noreferrer"
									>
										LinkedIn
									</a>
								</li>
								<li>
									<a
										href="https://x.com/joseantcordeiro"
										className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
										target="_blank"
										rel="noreferrer"
									>
										X
									</a>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="font-semibold mb-4">Legal</h3>
							<ul className="space-y-2">
								<li>
									<Link
										to="/privacy-policy"
										className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
										target="_blank"
										rel="noreferrer"
									>
										Privacy Policy
									</Link>
								</li>
								<li>
									<Link
										to="/tos"
										className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
										target="_blank"
										rel="noreferrer"
									>
										Terms of Service
									</Link>
								</li>
							</ul>
						</div>
					</div>
				</div>
				<div className=" w-full flex mt-4 items-center justify-center   ">
					<h1 className="text-center text-3xl md:text-5xl lg:text-[10rem] font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-700 to-neutral-900 select-none">
						smedrec
					</h1>
				</div>
			</div>
		</footer>
	)
}
