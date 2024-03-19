"use server"

import Post from "@/models/Post"
import User from "@/models/User"

interface ISearchQuery {
	authorId?: string[]
	parentId?: string
}

interface IGetPosts extends ISearchQuery {
	limit: number
	skip: number
}

export default async ({ authorId, parentId, limit, skip }: IGetPosts) => {
	const query: ISearchQuery = {}
	if (authorId) query.authorId = authorId
	if (parentId) query.parentId = parentId

	const posts = await Post.find(query).sort({ created: -1 }).skip(skip).limit(limit)

	const profiles = await User.find({ _id: posts.map(({ authorId }) => authorId) })

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
