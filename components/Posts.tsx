"use client"

import getPosts from "@/actions/getPosts"
import { ReloadIcon } from "@radix-ui/react-icons"
import Link from "next/link"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"
import UserCardProvider from "./UserCardProvider"
import { UserAvatar } from "@/components/UserAvatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { LuHeart, LuMessageCircle } from "react-icons/lu"
import { getAuthId } from "@/actions/getAuthId"
import updatePostLike from "@/actions/updatePostLike"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { RxDotsHorizontal } from "react-icons/rx"
import deletePost from "@/actions/deletePost"
import PostForm from "@/components/PostForm"

export const Post = ({
	post,
	user,
	authId,
	hideParent,
	setPosts,
	className,
}: {
	post: Post
	user: User
	authId: string | null
	hideParent?: boolean
	setPosts: Dispatch<SetStateAction<ExtendedPost[]>>
	className?: string
}) => {
	const likePost = (postId: string) => {
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

		updatePostLike({
			postId,
			authId,
			like,
		})
	}

	const delPost = (postId: string) => {
		setPosts((prev) => prev.filter(({ post, parentPost }) => post._id !== postId && parentPost?._id !== postId))

		deletePost(postId)
	}

	return (
		<>
			{/* post */}
			<div
				className={`group/post relative grid grid-cols-[auto_1fr] items-stretch gap-[.6875rem] items-start hover:bg-[#00000006] text-sm px-5 py-4 transition ${className}`}
			>
				{/* post link */}
				<Link href={`/${user.username}/${post._id}`} className="cursor-pointer absolute inset-0" />

				{/* left */}
				<div>
					{/* pfp */}
					<UserCardProvider {...{ user }}>
						<Link href={`/${user.username}`} className="rounded-full">
							<UserAvatar src={user.pfp} className="w-8 h-8 hover:brightness-[.92] transition" />
						</Link>
					</UserCardProvider>
					{/* post chain */}
					{!hideParent && post.parentId && (
						<div className="pointer-events-none relative l-[50%] -translate-x-[50%] h-[calc(100%-0.5rem)] border-r-2 border-dashed mt-1" />
					)}
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

						{/* context menu */}
						<div className="ml-auto">
							{authId === user._id && (
								<DropdownMenu>
									<DropdownMenuTrigger className="relative md:opacity-0 group-hover/post:opacity-100 focus:opacity-100 transition p-2 -m-2">
										<RxDotsHorizontal />
									</DropdownMenuTrigger>
									<DropdownMenuContent className="mr-2">
										<DropdownMenuItem className="cursor-pointer" onClick={() => delPost(post._id)}>
											Delete
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							)}
						</div>
					</div>

					{/* body */}
					<p className="relative inline overflow-wrap-break-word break-word break-all  text-sm">{post.body}</p>

					{/* actions */}
					<div className="flex gap-8 mt-2">
						{/* like */}
						<div className="relative group/like cursor-pointer flex items-center gap-2">
							<button
								onClick={() => likePost(post._id)}
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
							<Link
								href={`/${user.username}/${post._id}#comments`}
								className="group-hover/comment:bg-[#1D9BF01A] rounded-full transition p-2 -m-2"
							>
								<LuMessageCircle className="group-hover/comment:stroke-[#1D9BF0] transition" />
							</Link>
							<span className="text-xs group-hover/comment:text-[#1D9BF0] transition">{post.replies}</span>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default ({ authorId, parentId }: { authorId?: string[]; parentId?: string }) => {
	const hideParent = parentId ? true : false
	const [authId, setAuthId] = useState<string | null>(null)
	const perPage = 1
	const [posts, setPosts] = useState<ExtendedPost[]>([])
	const [loading, setLoading] = useState(false)
	const [observerVisible, setObserverVisible] = useState(true)
	const { ref, inView } = useInView({
		// rootMargin: "200px",
	})

	useEffect(() => {
		getAuthId().then((data) => setAuthId(data))
	}, [])

	// load posts on observer in view
	useEffect(() => {
		if (inView && !loading) {
			setLoading(true)
			const addPosts = async () => {
				try {
					const data = await getPosts({ authorId, parentId, limit: perPage, skip: posts.length })
					if (data.length === 0) setObserverVisible(false)
					else {
						setPosts((prev) => {
							const ids = prev.map(({ post }) => post._id)
							return [...prev, ...data.filter((item) => !ids.includes(item.post._id))]
						})
					}
				} catch (error) {
					console.error("Error fetching posts:", error)
				} finally {
					setLoading(false)
				}
			}
			addPosts()
		}
	}, [inView, loading])

	return (
		<div id="comments">
			{/* new post / post reply */}
			{/* display only if users ids array length is more than 1 (e.g. in feed) OR parent post id is provided (e.g. in replies) */}
			{((authorId && authorId.length > 1) || parentId) && (
				<div className="border-b">
					<PostForm {...{ parentId, setPosts }} />
				</div>
			)}

			{/* posts */}
			{posts.map(
				({ post, user, parentPost, parentPostUser }) =>
					user && (
						<div className="border-b -my-[.0625rem]" key={post._id}>
							{/* post */}
							<Post {...{ user, post, authId, hideParent, setPosts }} className="border-t" />
							{/* parent post */}
							{!hideParent && parentPost && parentPostUser && (
								<Post user={parentPostUser} post={parentPost} {...{ authId, setPosts }} />
							)}
							{/* if parent post not found */}
							{post.parentId && !parentPost && (
								<div className="text-sm border-b px-5 py-4 -mb-[.0625rem]">Post not found</div>
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
		</div>
	)
}
