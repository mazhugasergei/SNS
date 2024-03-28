"use server"

import User from "@/models/User"
import { getAuthId } from "./getAuthId"

export const searchUsers = async (search: string = ""): Promise<User[]> => {
	const authId = await getAuthId()
	const authUser = (await getAuthId()) ? await User.findById(authId) : null
	// If no search string, return following users of authenticated user
	const users =
		!search && authUser && !!authUser.following.length
			? await User.find({ _id: authUser.following }, "-password").limit(5)
			: // Else search users by username or fullname and limit to 5
			  await User.find(
					{
						$or: [{ username: { $regex: search, $options: "i" } }, { fullname: { $regex: search, $options: "i" } }],
					},
					"-password"
			  ).limit(5)
	// Return users as JSON object
	return JSON.parse(JSON.stringify(users))
}
