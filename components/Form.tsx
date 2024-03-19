"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import newPost from "../actions/newPost"
import { useFormError } from "@/hooks/useFormError"
import { UserAvatar } from "@/components/UserAvatar"
import { useEffect, useRef, useState } from "react"
import { getAuthId } from "@/actions/getAuthId"
import getUser from "@/actions/getUser"
import Link from "next/link"

interface IUser {
	username: string
	pfp?: string | null
}

const formSchema = z.object({
	body: z.string().min(1).max(300),
})

export default ({ parentId }: { parentId?: string }) => {
	const [authId, setAuthId] = useState<string | null>()
	const [authUser, setAuthUser] = useState<IUser | null>()

	useEffect(() => {
		getAuthId().then((_id) => {
			setAuthId(_id)
			if (!_id) return
			getUser({ _id }).then((data) => setAuthUser(data))
		})
	}, [])

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			body: "",
		},
	})

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		if (!authUser) return
		const { body } = values
		await newPost({ body })
			.then((postId) => {
				if (parentId) {
				} else window.location.href = `/${authUser.username}/${postId}`
			})
			.catch((err) => useFormError(form, err, onSubmit))
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col border-b px-5 py-2">
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
										href={authUser ? `/${authUser?.username}` : typeof authUser === null ? "/log-in" : ""}
										className="rounded-full"
									>
										<UserAvatar src={authUser?.pfp} className="w-8 h-8 hover:brightness-[.92] transition" />
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
					{parentId ? "Reply" : "Submit"}
				</Button>
			</form>
		</Form>
	)
}
