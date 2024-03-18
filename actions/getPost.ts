"use server"

import Post from "@/models/Post"

export default async (query: { _id: string }) => {
	const post = await Post.findOne(query)
	if (!post) throw "Post not found"
	const replies = await Post.find({ parentId: post._id })
	return { ...JSON.parse(JSON.stringify(post)), replies: replies.length }
}
