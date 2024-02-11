"use server"
import User from "@/models/User"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

export const logIn = async (email: string, password: string) => {
	// check rather the email provided is an email or a username
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	const username = emailRegex.test(email) ? null : email
	// does the user exist
	const user = await User.findOne(username ? { username } : { email })
	if (!user) throw "[email]: User doesn't exist"
	// check if the password is correct
	const isValid = await bcrypt.compare(password, user.password)
	if (!isValid) throw "[password]: Incorrect password"

	// create token
	const token = jwt.sign({ _id: user._id, password: user.password }, process.env.JWT_SECRET || "", { expiresIn: "30d" })

	// sace token
	cookies().set("token", token, { expires: new Date(new Date().getTime() + 2592000000) })

	return { ok: true }
}
