import Link from "next/link"
import UserCardProvider from "@/components/UserCardProvider"
import User from "@/models/User"

export default async () => {
	const tempUser = async (username: string) => {
		const user = await User.findOne({ username }, ["_id", "username", "fullname", "pfp", "bio"])
		if (!user) return null
		return {
			_id: user._id.toString(),
			username: user.username,
			fullname: user.fullname,
			pfp: user.pfp,
			bio: user.bio
		}
	}

	const mazhugasergei = await tempUser("mazhugasergei")

	return (
		<>
			{mazhugasergei && (
				<UserCardProvider user={mazhugasergei}>
					<Link href="/mazhugasergei" className="text-sm hover:underline">
						@mazhugasergei
					</Link>
				</UserCardProvider>
			)}
		</>
	)
}
