"use client"

import { useEffect, useState } from "react"
import { LuHeart, LuMessageCircle } from "react-icons/lu"
import getPost from "../actions/getPost"
import updateLike from "../../actions/updateLike"

interface IPost {
	_id: string
	body: string
	likes: string[]
	created: Date
}

export default ({ authId, postId }: { authId: string | null; postId: string }) => {
	const [post, setPost] = useState<IPost | null>(null)

	useEffect(() => {
		getPost(postId).then((data) => setPost(data))
	}, [])

	if (!post) return "loading..."

	const like = () => {
		if (!authId) return

		setPost((prev) => {
			if (!prev) return null
			return {
				...prev,
				likes: post.likes.includes(authId) ? prev.likes.filter((item) => item !== authId) : [authId, ...prev.likes],
			}
		})

		updateLike({ postId, authId, like: post.likes.includes(authId) ? false : true })
	}

	return (
		<div className="flex gap-8 px-[2.9375rem] py-3">
			{/* like */}
			<div className="relative group cursor-pointer flex items-center gap-2">
				<button onClick={() => like()} className="group-hover:bg-[#F918801A] rounded-full transition p-2 -m-2">
					<LuHeart
						className="group-hover:stroke-[#F92083] transition"
						style={{
							fill: authId && post.likes.includes(authId) ? "#F92083" : "",
							stroke: authId && post.likes.includes(authId) ? "#F92083" : "",
						}}
					/>
				</button>
				<span
					className="text-xs group-hover:text-[#F92083] transition"
					style={{ color: authId && post.likes.includes(authId) ? "#F92083" : "" }}
				>
					{post.likes.length}
				</span>
			</div>
			{/* comment */}
			<div className="relative group cursor-pointer flex items-center gap-2">
				<button className="group-hover:bg-[#1D9BF01A] rounded-full transition p-2 -m-2">
					<LuMessageCircle className="group-hover:stroke-[#1D9BF0] transition" />
				</button>
				{/* <span className="text-xs group-hover:text-[#1D9BF0] transition">{post.comments}</span> */}
			</div>
		</div>
	)
}
