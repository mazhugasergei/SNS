"use server"

import Post from "@/models/Post"
import { redirect } from "next/navigation"

export default async ({ postId, authId, like }: { postId: string; authId: string | null; like: boolean }) => {
	if (!authId) return redirect("/log-in")

	const post = await Post.findById(postId)
	if (!post) throw "Post not found"

	if (like) post.likes.unshift(authId)
	else post.likes = post.likes.filter((item) => item !== authId)

	await post.save()
}
