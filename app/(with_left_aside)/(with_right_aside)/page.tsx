import Link from "next/link"
import UserCardProvider from "@/components/UserCardProvider"
import User from "@/models/User"

export default async () => {
	const mazhugasergei = await User.findOne({ username: "mazhugasergei" })

	return (
		<>
			<p>Main page, recommended posts (or so) will be here.</p>
			{mazhugasergei && (
				<UserCardProvider user={JSON.parse(JSON.stringify(mazhugasergei))}>
					<Link href="/mazhugasergei" className="text-sm hover:underline">
						@mazhugasergei
					</Link>
				</UserCardProvider>
			)}
		</>
	)
}
