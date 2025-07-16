import { Link } from "@tanstack/react-router";

import { Icons } from "@/components/icons";

export function Footer() {
	return (
		<footer className="px-4 py-12 md:px-6">
			<div className="container mx-auto">
				<div className="flex flex-col justify-between md:flex-row">
					<div className="mb-8 md:mb-0">
						<Link to="/" className="flex items-center gap-2">
							<Icons.logo className="icon-class w-8" />
							<h2 className="font-bold text-lg">SMEDREC</h2>
						</Link>

						<h1 className="mt-4 dark:text-gray-300">
							Build by{" "}
							<span className="dark:text-[#039ee4]">
								<a
									href="https://github.com/joseantcordeiro"
									target="_blank"
									rel="noreferrer"
								>
									@joseantcordeiro
								</a>
							</span>
						</h1>

						<p className="mt-5 text-sm dark:text-gray-400">
							© {new Date().getFullYear()} José Cordeiro.
						</p>
						<p className="mt-5 text-sm dark:text-gray-400">
							Licensed under the MIT License (MIT)
						</p>
					</div>
					<div className="grid grid-cols-2 gap-8 md:grid-cols-4">
						<div>
							<h3 className="mb-4 font-semibold">Pages</h3>
							<ul className="space-y-2">
								<li>
									<a
										href="#docs"
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
										href="#blog"
										className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
									>
										Blog
									</a>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="mb-4 font-semibold">Socials</h3>
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
							<h3 className="mb-4 font-semibold">Legal</h3>
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
				<div className=" mt-4 flex w-full items-center justify-center ">
					<h1 className="select-none bg-gradient-to-b from-neutral-700 to-neutral-900 bg-clip-text text-center font-bold text-3xl text-transparent md:text-5xl lg:text-[10rem]">
						smedrec
					</h1>
				</div>
			</div>
		</footer>
	);
}
