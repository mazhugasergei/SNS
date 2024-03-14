"use server"

import Post from "@/models/Post"

export default async (postId: string) => {
  await Post.findByIdAndDelete(postId)
}
