"use server"
import { getAuthId } from "@/actions/getAuthId"
import Message from "@/models/Message"
import User from "@/models/User"

export const sendMessage = async ({ chatId, body }: { chatId: string; body: string }) => {
	const authId = await getAuthId()
	if (!authId) throw "Not authorized"
	const user = await User.findById(authId)
	if (!user) throw "User not found"

	const message = await Message.create({ senderId: authId, chatId, body })

	return JSON.parse(JSON.stringify({ message, user }))
}
