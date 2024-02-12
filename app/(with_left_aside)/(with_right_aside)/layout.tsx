import type { Metadata } from "next"
import RightAside from "./components/RightAside"
import { ReactNode } from "react"

export const metadata: Metadata = {
	title: "Home - Wave"
}

export default ({ children }: { children: ReactNode }) => {
	return (
		<>
			<main className="flex-1 pt-4 sm:pt-8">{children}</main>
			<RightAside />
		</>
	)
}
