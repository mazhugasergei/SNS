"use server"

import Message from "@/models/Message"
import User from "@/models/User"

type SearchQuery = {
	_id?: string
	chatId: string
}

type GetMessages = SearchQuery & {
	limit?: number
	skip?: number
}

export default async ({ limit, skip, ...query }: GetMessages) => {
	const messages = await Message.find(query)
		.sort({ created: -1 })
		.skip(skip || 0)
		.limit(limit || 1)

	const profiles = await User.find({ _id: messages.map(({ senderId }) => senderId) }, "_id username fullname pfp")

	const res = []
	for (const message of messages) {
		const user = profiles.find(({ _id }) => _id === message.senderId) || null
		const parentMessage = message.parentId ? await Message.findById(message.parentId) : null
		const parentMessageUser = message.parentId ? await User.findById(parentMessage?.senderId) : null
		res.push({
			message: { ...JSON.parse(JSON.stringify(message)) },
			user: JSON.parse(JSON.stringify(user)),
			parentMessage: { ...JSON.parse(JSON.stringify(parentMessage)) },
			parentMessageUser: JSON.parse(JSON.stringify(parentMessageUser)),
		})
	}

	return res
}
