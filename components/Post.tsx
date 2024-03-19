"use client"

import { getAuthId } from "@/actions/getAuthId"
import { useEffect, useState } from "react"
import { LuChevronLeft, LuHeart, LuMessageCircle } from "react-icons/lu"
import { Button } from "./ui/button"
import getUser from "@/actions/getUser"
import getPost from "@/actions/getPost"
import UserCardProvider from "./UserCardProvider"
import Link from "next/link"
import { UserAvatar } from "./UserAvatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { RxDotsHorizontal } from "react-icons/rx"
import updatePostLike from "@/actions/updatePostLike"
import deletePost from "@/actions/deletePost"

interface IUser {
	_id: string
	username: string
	fullname: string
	pfp?: string | null
	bio?: string | null
}

interface IPost {
	_id: string
	body: string
	likes: string[]
	replies: number
	parentId?: string | null
	created: string
}

export default ({ username, postId }: { username: string; postId: string }) => {
	const [authId, setAuthId] = useState<string | null>(null)
	const [user, setUser] = useState<IUser | null>(null)
	const [post, setPost] = useState<IPost | null>(null)

	useEffect(() => {
		getAuthId().then((data) => setAuthId(data))
		getUser({ username }).then((data) => setUser(data))
		getPost({ _id: postId }).then((data) => setPost(data))
	}, [])

	const likePost = (postId: string) => {
		if (!authId) return

		setPost((prev) => {
			if (!prev) return null
			const { likes } = prev
			return {
				...prev,
				likes: likes.includes(authId) ? likes.filter((item) => item !== authId) : [authId, ...likes],
			}
		})

		updatePostLike({ postId, authId, like: post?.likes.includes(authId) ? false : true })
	}

	const delPost = (postId: string) => {
		deletePost(postId).then(() => (window.location.href = "/"))
	}

	return (
		<div className="text-sm border-b">
			<div className="px-5">
				{/* user */}
				{user && (
					<div className="relative grid grid-cols-[auto_1fr] grid-rows-[auto_auto] gap-x-[.6875rem] items-center">
						{/* post chain */}
						{post?.parentId ? <div className="w-0 h-3 place-self-center border-r-2 border-dashed" /> : <div />}

						<div />

						{/* pfp */}
						<UserCardProvider {...{ user }}>
							<Link href={`/${user.username}`} className="rounded-full">
								<UserAvatar src={user.pfp} className="w-8 h-8 hover:brightness-[.92] transition" />
							</Link>
						</UserCardProvider>

						<div className="flex">
							{/* name */}
							<UserCardProvider {...{ user }}>
								<Link href={`/${user.username}`}>
									<span className="font-bold hover:underline">{user.fullname}</span>
									<div className="opacity-70"> @{user.username}</div>
								</Link>
							</UserCardProvider>

							{/* context menu */}
							<div className="ml-auto">
								{authId === user._id && (
									<DropdownMenu>
										<DropdownMenuTrigger className="p-2 -m-2">
											<RxDotsHorizontal />
										</DropdownMenuTrigger>
										<DropdownMenuContent className="mr-2">
											<DropdownMenuItem className="cursor-pointer" onClick={() => delPost(postId)}>
												Delete
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								)}
							</div>
						</div>
					</div>
				)}

				<p className="pt-2">{post?.body}</p>

				{/* date */}
				{post && (
					<div className="opacity-70 py-2">
						{new Date(post.created).toLocaleString("en-US", { hour: "numeric", minute: "2-digit" }) +
							" · " +
							new Date(post.created).toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric" })}
					</div>
				)}
			</div>

			{/* actions */}
			<div className="flex gap-8 border-t px-5 py-3">
				{/* like */}
				<div className="group/like cursor-pointer flex items-center gap-2">
					<button
						onClick={() => likePost(postId)}
						className="group-hover/like:bg-[#F918801A] rounded-full transition p-2 -m-2"
					>
						<LuHeart
							className="w-4 h-4 group-hover/like:stroke-[#F92083] transition"
							style={{
								fill: authId && post?.likes.includes(authId) ? "#F92083" : "",
								stroke: authId && post?.likes.includes(authId) ? "#F92083" : "",
							}}
						/>
					</button>
					<span
						className="text-xs group-hover/like:text-[#F92083] transition"
						style={{ color: authId && post?.likes.includes(authId) ? "#F92083" : "" }}
					>
						{post?.likes.length}
					</span>
				</div>
				{/* comment */}
				<div className="group/comment cursor-pointer flex items-center gap-2">
					<Link href="#comments" className="group-hover/comment:bg-[#1D9BF01A] rounded-full transition p-2 -m-2">
						<LuMessageCircle className="w-4 h-4 group-hover/comment:stroke-[#1D9BF0] transition" />
					</Link>
					<span className="text-xs group-hover/comment:text-[#1D9BF0] transition">{post?.replies}</span>
				</div>
			</div>
		</div>
	)
}
