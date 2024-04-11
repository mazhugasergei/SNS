import { buttonVariants } from "@/components/ui/button"
import User from "@/models/User"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async ({ searchParams }: { searchParams: { _id: string; code: string } }) => {
	const { _id, code } = searchParams

	await (async () => {
		const user = await User.findById(_id)
		if (!user) throw "User not found"
		if (user.verificationCode !== code) throw "Codes differ"
		await user.updateOne({ $unset: { verificationCode: 1, expires: 1 } })
	})().catch(() => redirect("/"))

	return (
		<div className="space-y-2">
			<h1 className="text-4xl font-bold tracking-tight">Verified successfully!</h1>
			<p className="text-sm font-medium">Thanks for verifying your email.</p>
			<Link href="/log-in" className={buttonVariants()}>
				Log in
			</Link>
		</div>
	)
}
