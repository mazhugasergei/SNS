"use server"

import User from "@/models/User"

export default async (username: string) => {
	return await User.findOne({ username: username })
}
