"use server"

import User from "@/models/User"

export default async ({ authId, userId, follow }: { authId: string; userId: string; follow: boolean }) => {
	const authUser = await User.findById(authId)
	if (!authUser) throw "User not found"
	await authUser.updateOne({
		following: follow ? [userId, ...authUser.following] : authUser.following.filter((item) => item !== userId),
	})
}
