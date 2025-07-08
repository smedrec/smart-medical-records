import React from 'react'

function StatusCard() {
	return (
		<button className="group relative">
			<div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-teal-500 via-emerald-500 to-green-500 opacity-20 blur-xl transition-all duration-500 group-hover:opacity-50 group-hover:blur-2xl" />
			<div className="relative flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 p-1 pr-4">
				<div className="flex items-center gap-3 rounded-lg bg-slate-900/50 px-3 py-2">
					<div className="relative">
						<div className="absolute -inset-1 rounded-lg bg-teal-500/20 blur-sm transition-all duration-300 group-hover:bg-teal-500/30 group-hover:blur-md" />
						<svg
							stroke="currentColor"
							viewBox="0 0 24 24"
							fill="none"
							className="relative h-6 w-6 text-teal-500"
						>
							<path
								d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
								strokeWidth={2}
								strokeLinejoin="round"
								strokeLinecap="round"
							/>
						</svg>
					</div>
					<div className="flex flex-col">
						<div className="flex items-center gap-1">
							<span className="text-lg font-bold text-white">89.3%</span>
							<svg
								stroke="currentColor"
								viewBox="0 0 24 24"
								fill="none"
								className="h-4 w-4 text-emerald-500 transform transition-transform duration-300 group-hover:translate-y-[-2px]"
							>
								<path
									d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
									strokeWidth={2}
									strokeLinejoin="round"
									strokeLinecap="round"
								/>
							</svg>
						</div>
						<span className="text-[10px] font-medium text-slate-400">Performance</span>
					</div>
				</div>
				<div className="flex items-center gap-4">
					<div className="flex gap-3">
						<div className="flex flex-col items-center gap-1">
							<div className="h-8 w-1.5 rounded-full bg-slate-800 p-[2px]">
								<div className="h-4 w-full rounded-full bg-emerald-500/50 transition-all duration-300 group-hover:h-6" />
							</div>
							<span className="text-[10px] font-medium text-slate-400">CPU</span>
						</div>
						<div className="flex flex-col items-center gap-1">
							<div className="h-8 w-1.5 rounded-full bg-slate-800 p-[2px]">
								<div className="h-6 w-full rounded-full bg-teal-500/50 transition-all duration-300 group-hover:h-7" />
							</div>
							<span className="text-[10px] font-medium text-slate-400">MEM</span>
						</div>
					</div>
					<div className="flex items-center gap-1.5">
						<div className="h-2 w-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
						<span className="text-xs font-semibold text-slate-300">ONLINE</span>
					</div>
				</div>
				<div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-teal-500 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
				<div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
			</div>
		</button>
	)
}

export { StatusCard }
