import Link from "next/link"

export default ({ className }: { className?: string }) => {
	return (
		<Link
			href="/"
			className={`min-h-[2.25rem] flex md:inline-flex max-md:justify-center items-center md:self-start hover:bg-accent text-center text-sm font-medium rounded-md transition p-2 sm:px-4 ${className}`}
		>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="h-5 w-5 md:h-6 md:w-6">
				<rect width="256" height="256" fill="none" />
				<line
					x1="208"
					y1="128"
					x2="128"
					y2="208"
					fill="none"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="16"
				/>
				<line
					x1="192"
					y1="40"
					x2="40"
					y2="192"
					fill="none"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="16"
				/>
			</svg>
			<span className="max-md:hidden font-bold px-2">Wave</span>
		</Link>
	)
}
