"use server"

import User from "@/models/User"
import bcrypt from "bcrypt"
import { cookies } from "next/headers"

interface IAccount {
	_id: string
	currentPassword?: string
	newPassword?: string
}

export const updateAccount = async (data: IAccount) => {
	const { _id, currentPassword, newPassword } = data
	const user = await User.findById(_id)
	if (!user) throw ""

	// if changing password
	if (currentPassword?.length && newPassword?.length) {
		// check if entered current password is valid
		const isValid = await bcrypt.compare(currentPassword, user.password)
		if (!isValid) throw "[currentPassword]: Incorrect password"

		// update password
		await user.updateOne({ password: await bcrypt.hash(newPassword, 12) })

		// delete token
		cookies().delete("token")
	}

	return { ok: true }
}
