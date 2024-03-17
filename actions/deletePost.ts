"use server"

import Post from "@/models/Post"

export default async (postId: string) => {
	await Post.deleteMany({ parentId: postId })
	await Post.findByIdAndDelete(postId)
}
