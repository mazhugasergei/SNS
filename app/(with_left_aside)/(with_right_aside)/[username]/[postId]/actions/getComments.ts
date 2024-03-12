"use server"

import Comment from "@/models/Comment"

export default async ({ postId, limit, skip }: { postId: string; limit: number; skip: number }) => {
	return await Comment.find({ postId }).sort({ created: -1 }).skip(skip).limit(limit)
}
