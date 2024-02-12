"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { buttonVariants } from "@/components/ui/button"

const items = [
	{
		title: "Profile",
		href: "/settings/profile",
	},
	{
		title: "Account",
		href: "/settings/account",
	},
	{
		title: "Appearance",
		href: "/settings/appearance",
	},
]

export default () => {
	const pathname = usePathname()

	return (
		<aside className="lg:w-1/5 xl:w-1/6">
			<nav className="flex flex-wrap gap-2 lg:sticky lg:top-8 lg:flex-col sm:-ml-4">
				{items.map((item) => (
					<Link
						key={item.href}
						href={item.href}
						className={`${buttonVariants({ variant: "ghost" })} ${
							pathname === item.href ? "bg-muted" : "hover:bg-transparent hover:underline"
						}`}
						style={{ justifyContent: "flex-start" }}
					>
						{item.title}
					</Link>
				))}
			</nav>
		</aside>
	)
}
