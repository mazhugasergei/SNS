type User = {
	_id: string
	username: string
	fullname: string
	pfp?: string | null
	bio?: string | null
	following: string[]
}

type Post = {
	_id: string
	body: string
	likes: string[]
	replies?: number
	parentId?: string
	created: Date
}

type ExtendedPost = {
	post: Post
	user: User | null
	parentPost: Post | null
	parentPostUser: User | null
}

type Chat = {
	_id: string
	name: string
	image?: string | null
	participants: string[]
	lastMessage?: string | null
	lastMessageTime?: Date | null
	created: Date
}

type Message = {
	_id: string
	senderId: string
	chatId: string
	body: string
	created: Date
}

type ExtendedMessage = {
	message: Message
	user: User | null
	parentMessage: Message | null
	parentMessageUser: User | null
}
