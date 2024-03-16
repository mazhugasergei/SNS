"use server"

import Post from "@/models/Post"
import User from "@/models/User"

export default async ({ users, limit, skip }: { users: string[]; limit: number; skip: number }) => {
	const posts = await Post.find({ authorId: users }).sort({ created: -1 }).skip(skip).limit(limit)
	const profiles = await User.find({ _id: users })
	const res = []
	for (const post of posts) {
		const user = profiles.find(({ _id }) => _id === post.authorId) || null
		const replies = (await Post.find({ parentId: post._id })).length
		const parentPost = post.parentId ? await Post.findById(post.parentId) : null
		const parentPostUser = post.parentId ? await User.findById(parentPost?.authorId) : null
		res.push({
			post: { ...JSON.parse(JSON.stringify(post)), replies },
			user: JSON.parse(JSON.stringify(user)),
			parentPost: JSON.parse(JSON.stringify(parentPost)),
			parentPostUser: JSON.parse(JSON.stringify(parentPostUser)),
		})
	}
	return res
}
