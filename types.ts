interface User {
	_id: string
	username: string
	fullname: string
	pfp?: string | null
	bio?: string | null
	following: string[]
}

interface Post {
	_id: string
	body: string
	likes: string[]
	replies?: number
	parentId?: string
	created: Date
}

interface ExtendedPost {
	user: User | null
	post: Post
	parentPost: Post | null
	parentPostUser: User | null
}

interface Chat {
	_id: string
	name: string
	image?: string | null
	participants: string[]
	lastMessage?: string | null
	lastMessageTime?: Date | null
	created: Date
}
