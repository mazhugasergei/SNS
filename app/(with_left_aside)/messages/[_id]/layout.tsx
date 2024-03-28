import { ReactNode } from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
	title: "Messages - Wave",
}

export default async ({ children }: { children: ReactNode }) => {
	return <>{children}</>
}
