"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import newPost from "../actions/newPost"
import { useFormError } from "@/hooks/useFormError"
import { UserAvatar } from "@/components/UserAvatar"
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import { getAuthId } from "@/actions/getAuthId"
import getUser from "@/actions/getUser"
import Link from "next/link"
import getPosts from "@/actions/getPosts"

const formSchema = z.object({
	body: z.string().min(1).max(300),
})

export default ({ parentId, setPosts }: { parentId?: string; setPosts: Dispatch<SetStateAction<ExtendedPost[]>> }) => {
	const [authId, setAuthId] = useState<string | null>()
	const [user, setUser] = useState<User | null>()

	useEffect(() => {
		getAuthId().then((_id) => {
			setAuthId(_id)
			if (!_id) return
			getUser({ _id }).then((data) => setUser(data))
		})
	}, [])

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			body: "",
		},
	})

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		if (!user) return
		const { body } = values
		await newPost({ parentId, body })
			.then((postId) => {
				if (parentId) {
					getPosts({ _id: postId }).then((data) => {
						form.reset()
						setPosts((prev) => [...data, ...prev])
					})
				} else window.location.href = `/${user.username}/${postId}`
			})
			.catch((err) => useFormError(form, err, onSubmit))
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col px-5 py-4">
				<FormField
					control={form.control}
					name="body"
					render={({ field }) => (
						<FormItem
							onChange={(e) => {
								if (authId === null) window.location.href = "/log-in"
								const textarea = e.target as HTMLTextAreaElement
								textarea.style.height = ""
								textarea.style.height = `${textarea.scrollHeight}px`
							}}
						>
							<FormControl>
								<div className="grid grid-cols-[auto_1fr] items-start gap-2">
									<Link
										href={user ? `/${user?.username}` : typeof user === null ? "/log-in" : ""}
										className="rounded-full"
									>
										<UserAvatar src={user?.pfp} className="w-8 h-8 hover:brightness-[.92] transition" />
									</Link>
									<textarea
										placeholder={parentId ? "Reply..." : "New post..."}
										{...field}
										className="resize-none max-h-[20rem] border-none outline-none"
									/>
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" className="ml-auto mt-1" disabled={!form.watch("body").length}>
					{parentId ? "Reply" : "Post"}
				</Button>
			</form>
		</Form>
	)
}
