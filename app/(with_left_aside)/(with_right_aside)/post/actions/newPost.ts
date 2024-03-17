"use server"

import { getAuthId } from "@/actions/getAuthId"
import Post from "@/models/Post"

export default async ({ body }: { body: string }) => {
	const authorId = await getAuthId()
	if (!authorId) throw "Not auth"

	const post = await Post.create({
		authorId,
		body,
	})

	return post._id
}
