"use server"

import User from "@/models/User"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

export const getAuthId = async () => {
	const token = cookies().get("token")?.value
	if (!token) return null

	// verify token
	let _id: string | undefined, password: string | undefined
	try {
		jwt.verify(token, process.env.JWT_SECRET || "", (err, decoded) => {
			if (typeof decoded !== "object") return
			_id = decoded._id
			password = decoded.password
		})
	} catch (err) {
		console.error(err)
		return null
	}
	if (!_id || !password) return null

	// check if the user still exists
	const user = await User.findOne({ _id, password })
	if (!user) return null

	return _id
}
