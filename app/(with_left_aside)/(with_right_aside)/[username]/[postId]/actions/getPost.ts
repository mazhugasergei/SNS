"use server"

import Post from "@/models/Post"

export default async (postId: string) => {
	return await Post.findById(postId)
}
