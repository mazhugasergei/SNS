"use client"

import { useEffect, useState } from "react"
import getPosts from "../actions/getPosts"
import { useInView } from "react-intersection-observer"
import UserCardProvider from "@/components/UserCardProvider"
import Link from "next/link"
import { UserAvatar } from "@/app/(with_left_aside)/components/UserAvatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { LuHeart, LuMessageCircle } from "react-icons/lu"
import { ReloadIcon } from "@radix-ui/react-icons"
import updateLike from "../actions/updateLike"

interface IUser {
	_id: string
	username: string
	fullname: string
	pfp?: string | null
}

interface IPost {
	_id: string
	body: string
	likes: string[]
	comments: number
	created: Date
}

export default ({ user, authId }: { user: IUser; authId: string | null }) => {
	const perPage = 1
	const [page, setPage] = useState(0)
	const [posts, setPosts] = useState<IPost[]>([])
	const [loading, setLoading] = useState(false)
	const [observerVisible, setObserverVisible] = useState(true)
	const { ref, inView } = useInView({ rootMargin: "200px" })

	// on observer in view
	useEffect(() => {
		if (inView && !loading) {
			setLoading(true)
			const addPosts = async () => {
				try {
					const data = await getPosts({ authorId: user._id, limit: perPage, skip: perPage * page })
					if (data.length === 0) {
						setObserverVisible(false)
					} else {
						setPosts((prev) => [...prev, ...data])
						setPage((prev) => prev + 1)
					}
				} catch (error) {
					console.error("Error fetching posts:", error)
				} finally {
					setLoading(false)
				}
			}
			addPosts()
		}
	}, [inView, loading, page])

	const like = (postId: string) => {
		if (!authId) return

		let like = false

		setPosts((prev) =>
			prev.map((post) => {
				if (post._id === postId) {
					// remove like
					if (post.likes.includes(authId)) {
						return { ...post, likes: post.likes.filter((item) => item !== authId) }
					}
					// add like
					else {
						like = true
						return { ...post, likes: [authId, ...post.likes] }
					}
				} else return post
			})
		)

		updateLike({ postId, authId, like })
	}

	return (
		<>
			<div className="-mb-[.0625rem]">
				{posts.map((post) => (
					<div
						className="relative grid grid-cols-[auto_1fr] gap-[.6875rem] items-start hover:bg-[#00000006] border-b text-sm px-8 py-5 transition"
						key={post._id}
					>
						{/* post link */}
						<Link href={`${user.username}/${post._id}`} className="cursor-pointer absolute inset-0" />
						{/* pfp */}
						<UserCardProvider {...{ user }}>
							<Link href={`/${user.username}`} className="rounded-full">
								<UserAvatar src={user.pfp} className="w-8 h-8 hover:brightness-[.92] transition" />
							</Link>
						</UserCardProvider>
						{/* the rest */}
						<div>
							{/* name */}
							<UserCardProvider {...{ user }}>
								<Link href={`/${user.username}`} className="relative">
									<span className="font-bold hover:underline">{user.fullname}</span>
									<span className="opacity-70"> @{user.username}</span>
								</Link>
							</UserCardProvider>

							{/* date */}
							<span className="opacity-70"> · </span>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger className="hover:underline">
										<span className="opacity-70">
											{new Date(post.created).toLocaleDateString("en-US", {
												year: "numeric",
												month: "short",
												day: "numeric",
											})}
										</span>
									</TooltipTrigger>
									<TooltipContent>
										{new Date(post.created).toLocaleTimeString("en-US", {
											hour: "numeric",
											minute: "2-digit",
											hour12: true,
										}) +
											" · " +
											new Date(post.created).toLocaleDateString("en-US", {
												year: "numeric",
												month: "short",
												day: "numeric",
											})}
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>

							{/* body */}
							<br />
							<p className="relative inline text-sm">{post.body}</p>

							{/* post tools */}
							<div className="flex gap-8 mt-2">
								{/* like */}
								<div className="relative group cursor-pointer flex items-center gap-2">
									<button
										onClick={async () => await like(post._id)}
										className="group-hover:bg-[#F918801A] rounded-full transition p-2 -m-2"
									>
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
									<span className="text-xs group-hover:text-[#1D9BF0] transition">{post.comments}</span>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
			{/* observer */}
			{observerVisible && (
				<div ref={ref} className="min-h-[5rem] grid place-items-center">
					<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
				</div>
			)}
		</>
	)
}
