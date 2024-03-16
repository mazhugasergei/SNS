"use client"

import getPosts from "@/actions/getPosts"
import { ReloadIcon } from "@radix-ui/react-icons"
import Link from "next/link"
import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"
import UserCardProvider from "./UserCardProvider"
import { UserAvatar } from "@/components/UserAvatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { LuHeart, LuMessageCircle } from "react-icons/lu"
import { getAuthId } from "@/actions/getAuthId"
import updateLike from "@/actions/updateLike"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { RxDotsHorizontal } from "react-icons/rx"

interface IPost {
	_id: string
	body: string
	likes: string[]
	replies?: number
	parentId?: string
	created: Date
}

interface IUser {
	_id: string
	username: string
	fullname: string
	pfp?: string | null
}

interface IExtendedPost {
	post: IPost
	user: IUser | null
	parentPost: IPost | null
	parentPostUser: IUser | null
}

export const Post = ({
	post,
	user,
	authId,
	parent,
	posts,
	setPosts,
}: {
	post: IPost
	user: IUser
	authId: string | null
	parent?: boolean
	posts: IExtendedPost[]
	setPosts: Dispatch<SetStateAction<IExtendedPost[]>>
}) => {
	const like = (postId: string) => {
		if (!authId) return

		let like = true

		setPosts((prev) =>
			prev.map((item) => {
				const post = { ...item.post }
				const parentPost = item.parentPost ? { ...item.parentPost } : null

				if (post._id === postId) {
					if (post.likes.includes(authId)) {
						post.likes = post.likes.filter((item) => item !== authId)
						like = false
					} else post.likes.unshift(authId)
				}

				if (parentPost?._id === postId) {
					if (parentPost.likes.includes(authId)) {
						parentPost.likes = parentPost.likes.filter((item) => item !== authId)
						like = false
					} else parentPost.likes.unshift(authId)
				}

				return { ...item, post, parentPost }
			})
		)

		updateLike({
			postId,
			authId,
			like,
		})
	}

	return (
		<>
			{/* post */}
			<div
				className={`group/post relative grid grid-cols-[auto_1fr] items-stretch gap-[.6875rem] items-start hover:bg-[#00000006] text-sm px-8 py-5 -mb-[.0625rem] transition ${
					!post.parentId && "border-b"
				}`}
			>
				{/* post link */}
				<Link href={`${user.username}/${post._id}`} className="cursor-pointer absolute inset-0" />
				{/* left */}
				<div>
					{/* pfp */}
					<UserCardProvider {...{ user }}>
						<Link href={`/${user.username}`} className="rounded-full">
							<UserAvatar src={user.pfp} className="w-8 h-8 hover:brightness-[.92] transition" />
						</Link>
					</UserCardProvider>
					{/* post chain */}
					{post.parentId && <div className="w-[50%] h-full border-r border-dashed mt-1" />}
				</div>
				{/* right */}
				<div>
					<div className="flex">
						{/* name */}
						<UserCardProvider {...{ user }}>
							<Link href={`/${user.username}`} className="relative">
								<span className="font-bold hover:underline">{user.fullname}</span>
								<span className="opacity-70"> @{user.username}</span>
							</Link>
						</UserCardProvider>

						{/* date */}
						<div className="opacity-70"> · </div>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger className="hover:underline">
									<div className="opacity-70">
										{new Date(post.created).toLocaleDateString("en-US", {
											year: "numeric",
											month: "short",
											day: "numeric",
										})}
									</div>
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

						{/* actions */}
						<div className="ml-auto">
							{authId === user._id && (
								<DropdownMenu>
									<DropdownMenuTrigger className="relative block md:hidden group-hover/post:block p-2 -m-2">
										<RxDotsHorizontal />
									</DropdownMenuTrigger>
									<DropdownMenuContent>
										<DropdownMenuItem>Delete</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							)}
						</div>
					</div>

					{/* body */}
					<p className="relative inline text-sm">{post.body}</p>

					{/* post tools */}
					<div className="flex gap-8 mt-2">
						{/* like */}
						<div className="relative group/like cursor-pointer flex items-center gap-2">
							<button
								onClick={() => like(post._id)}
								className="group-hover/like:bg-[#F918801A] rounded-full transition p-2 -m-2"
							>
								<LuHeart
									className="group-hover/like:stroke-[#F92083] transition"
									style={{
										fill: authId && post.likes.includes(authId) ? "#F92083" : "",
										stroke: authId && post.likes.includes(authId) ? "#F92083" : "",
									}}
								/>
							</button>
							<span
								className="text-xs group-hover/like:text-[#F92083] transition"
								style={{ color: authId && post.likes.includes(authId) ? "#F92083" : "" }}
							>
								{post.likes.length}
							</span>
						</div>
						{/* comment */}
						<div className="relative group/comment cursor-pointer flex items-center gap-2">
							<button className="group-hover/comment:bg-[#1D9BF01A] rounded-full transition p-2 -m-2">
								<LuMessageCircle className="group-hover/comment:stroke-[#1D9BF0] transition" />
							</button>
							<span className="text-xs group-hover/comment:text-[#1D9BF0] transition">{post.replies}</span>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default ({ users }: { users: string[] }) => {
	const [authId, setAuthId] = useState<string | null>(null)
	const perPage = 1
	const [page, setPage] = useState(0)
	const [posts, setPosts] = useState<IExtendedPost[]>([])
	const [loading, setLoading] = useState(false)
	const [observerVisible, setObserverVisible] = useState(true)
	const { ref, inView } = useInView({ rootMargin: "200px" })

	useEffect(() => {
		getAuthId().then((data) => setAuthId(data))
	}, [])

	// on observer in view
	useEffect(() => {
		if (inView && !loading) {
			setLoading(true)
			const addPosts = async () => {
				try {
					const data = await getPosts({ users, limit: perPage, skip: perPage * page })
					if (data.length === 0) setObserverVisible(false)
					else {
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

	return (
		<>
			{/* posts */}
			{posts.map(
				({ post, user, parentPost, parentPostUser }) =>
					user && (
						<div key={post._id}>
							<Post {...{ user, post, authId, posts, setPosts }} />
							{parentPost && parentPostUser && (
								<Post {...{ authId, posts, setPosts }} user={parentPostUser} post={parentPost} />
							)}
						</div>
					)
			)}

			{/* observer */}
			{observerVisible && (
				<div ref={ref} className="min-h-[5rem] grid place-items-center">
					<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
				</div>
			)}
		</>
	)
}