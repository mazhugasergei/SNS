"use server"

import Post from "@/models/Post"
import User from "@/models/User"

type SearchQuery = {
	_id?: string
	authorId?: string[]
	parentId?: string
}

type GetPosts = SearchQuery & {
	limit?: number
	skip?: number
}

export default async ({ limit, skip, ...query }: GetPosts) => {
	const posts = await Post.find(query)
		.sort({ created: -1 })
		.skip(skip || 0)
		.limit(limit || 1)

	const profiles = await User.find({ _id: posts.map(({ authorId }) => authorId) }, "_id fullname pfp")

	const res = []
	for (const post of posts) {
		const user = profiles.find(({ _id }) => _id === post.authorId) || null
		const postReplies = (await Post.find({ parentId: post._id })).length
		const parentPost = post.parentId ? await Post.findById(post.parentId) : null
		const parentPostReplies = parentPost ? (await Post.find({ parentId: parentPost._id })).length : null
		const parentPostUser = post.parentId ? await User.findById(parentPost?.authorId) : null
		res.push({
			post: { ...JSON.parse(JSON.stringify(post)), replies: postReplies },
			user: JSON.parse(JSON.stringify(user)),
			parentPost: { ...JSON.parse(JSON.stringify(parentPost)), replies: parentPostReplies },
			parentPostUser: JSON.parse(JSON.stringify(parentPostUser)),
		})
	}

	return res
}
