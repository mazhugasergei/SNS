"use server"

import Post from "@/models/Post"

export default async (postId: string) => {
	const post = await Post.findById(postId)
	if (!post) throw "Post not found"
	await post.deleteOne()

	const deleteChildrenPosts = async (parentPostId: string) => {
		const childrenPosts = await Post.find({ parentId: parentPostId })
		if (!childrenPosts.length) return
		for (const childPost of childrenPosts) {
			await deleteChildrenPosts(childPost._id)
			await childPost.deleteOne()
		}
	}

	await deleteChildrenPosts(postId)
}
