interface Post {
	_id: string
	body: string
	likes: string[]
	replies?: number
	parentId?: string
	created: Date
}

interface User {
	_id: string
	username: string
	fullname: string
	pfp?: string | null
	bio?: string | null
	following: string[]
}

interface ExtendedPost {
	user: User | null
	post: Post
	parentPost: Post | null
	parentPostUser: User | null
}
