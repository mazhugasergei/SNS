import "@/app/globals.css"
import { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import ThemeProvider from "@/components/ThemeProvider"
import mongoose from "mongoose"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
	title: "Wave",
	description: "Mazhuga Sergei's SNS graduation thesis",
}

export default async ({ children }: { children: React.ReactNode }) => {
	// connect to the db
	await mongoose.connect(process.env.MONGODB_URI!).then(() => console.log("connected to db"))

	return (
		<html lang="en" /* >>> */ suppressHydrationWarning={true} /* <<< */>
			<body className={`${inter.className} relative`}>
				<ThemeProvider attribute="class" disableTransitionOnChange>
					{children}
					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	)
}
