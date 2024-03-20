"use server"

import { getAuthId } from "@/actions/getAuthId"
import Post from "@/models/Post"

export default async ({ parentId, body }: { parentId: string | undefined; body: string }) => {
	const authorId = await getAuthId()
	if (!authorId) throw "Not auth"

	const post = await Post.create({
		authorId,
		parentId,
		body,
	})

	return post._id
}
