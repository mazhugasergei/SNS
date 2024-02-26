"use server"

import Comment from "@/models/Comment"
import Post from "@/models/Post"

export default async ({ authorId, limit, skip }: { authorId: string; limit: number; skip: number }) => {
	const posts = await Post.find({ authorId }).sort({ created: -1 }).skip(skip).limit(limit)
	const res = []
	for (const post of posts) {
		const comments = await Comment.find({ postId: post._id })
		res.push({
			...JSON.parse(JSON.stringify(post)),
			comments: comments.length,
		})
	}
	return res
}
