import { ReactNode } from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
	title: "Messages - Wave",
}

export default async ({ children }: { children: ReactNode }) => {
	return <main className="flex-1 h-[100vh] lg:grid grid-cols-[1fr_2fr]">{children}</main>
}
