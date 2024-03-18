"use server"

import User from "@/models/User"

export default async (query: { _id?: string; username?: string }) => {
	const user = await User.findOne(query)
	if (!user) throw "User not found"
	return JSON.parse(JSON.stringify(user))
}
