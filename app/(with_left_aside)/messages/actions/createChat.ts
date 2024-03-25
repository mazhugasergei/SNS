"use server"

import { getAuthId } from "@/actions/getAuthId"
import Chat from "@/models/Chat"

export default async (participants: string[]) => {
	const authId = await getAuthId()
	if (!authId) throw "Not authorized"
	const chat = await Chat.create({ participants: [authId, ...participants.filter((_id) => _id !== authId)] })
	return chat._id
}
