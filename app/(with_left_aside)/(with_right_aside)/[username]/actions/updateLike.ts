"use server"

import Post from "@/models/Post"

export default async (postId: string, userId: string) => {
	const post = await Post.findById(postId)
	if (!post) throw "Post not found"
	if (post.likes.includes(userId)) post.likes.filter((item) => item !== userId)
	else post.likes.push(userId)
	await post.save()
}
