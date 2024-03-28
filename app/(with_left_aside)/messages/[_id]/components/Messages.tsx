"use client"

import z from "zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { ReloadIcon } from "@radix-ui/react-icons"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { useFormError } from "@/hooks/useFormError"
import { LuSendHorizonal } from "react-icons/lu"
import { sendMessage } from "../../actions/sendMessage"
import { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"
import getMessages from "@/actions/getMessages"
import { getAuthId } from "@/actions/getAuthId"
import Link from "next/link"
import { UserAvatar } from "@/components/UserAvatar"

const formSchema = z.object({
	body: z.string(),
})

export default ({ chatId }: { chatId: string }) => {
	const [authId, setAuthId] = useState<string | null>(null)
	const perPage = 1
	const [messages, setMessages] = useState<ExtendedMessage[]>([])
	const [loading, setLoading] = useState(false)
	const [observerVisible, setObserverVisible] = useState(true)
	const { ref, inView } = useInView({
		// rootMargin: "200px",
	})

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			body: "",
		},
	})

	useEffect(() => {
		getAuthId().then((data) => setAuthId(data))
	}, [])

	useEffect(() => {
		if (inView && !loading) {
			setLoading(true)
			const addPosts = async () => {
				try {
					const data = await getMessages({ chatId, limit: perPage, skip: messages.length })
					if (data.length === 0) setObserverVisible(false)
					else {
						setMessages((prev) => {
							const ids = prev.map(({ message }) => message._id)
							return [...data.filter((item) => !ids.includes(item.message._id)), ...prev]
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

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		const { body } = data
		if (!body.length) return

		await sendMessage({ chatId, body: body })
			.then((message) => {
				setMessages((prev) => [...prev, message])
				form.reset()
			})
			.catch((err) => useFormError(form, err, onSubmit))
	}

	return (
		<>
			{/* observer */}
			{observerVisible && (
				<div ref={ref} className="min-h-[5rem] grid place-items-center">
					<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
				</div>
			)}

			{/* body */}
			<div className="flex-1 px-4">
				{messages.map(({ message, user }, i) => {
					const recent =
						i &&
						message.senderId === messages[i - 1].message.senderId &&
						new Date(message.created).getTime() - new Date(messages[i - 1].message.created).getTime() < 300000
					const showDate =
						!i || new Date(message.created).getTime() - new Date(messages[i - 1].message.created).getTime() >= 86400000
					return (
						<div className="flex flex-col" key={message._id?.toString()}>
							{/* date */}
							{showDate && (
								<div className="self-center text-xs font-medium text-center opacity-75 mt-2 mx-auto bg-secondary rounded-sm px-2 py-1">
									{new Date(new Date(message.created).getTime()).toLocaleDateString("default", {
										month: "long",
										day: "2-digit",
									})}
								</div>
							)}
							{/* message */}
							<div
								className={`group flex items-center gap-2 ${
									message.senderId === authId ? "flex-row-reverse self-end" : "self-start"
								} ${recent ? "mt-1" : "mt-2"}`}
							>
								{/* pfp */}
								{recent ? (
									<div className="w-7 h-7" />
								) : (
									<Link href={`/${user?.username}`} className="rounded-full hover:brightness-[.85] transition">
										<UserAvatar src={user?.pfp} className="w-7 h-7" />
									</Link>
								)}
								{/* body */}
								<div className="justify-self-start text-xs bg-secondary rounded-md p-2">{message.body}</div>
								{/* time */}
								<div className="cursor-default self-end text-[.5rem] opacity-0 group-hover:opacity-80 transition">
									{new Date(new Date(message.created).getTime()).toLocaleTimeString("en-UK", {
										hour: "2-digit",
										minute: "2-digit",
									})}
								</div>
							</div>
						</div>
					)
				})}
			</div>

			{/* input */}
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-1 border-t p-1">
					<FormField
						control={form.control}
						name="body"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormControl>
									<textarea
										placeholder="Message"
										{...field}
										className="w-full h-full min-h-[4rem] text-xs resize-none outline-none p-1"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button className="h-full" disabled={form.formState.isSubmitting}>
						{form.formState.isSubmitting ? (
							<ReloadIcon className="w-4 h-4 animate-spin" />
						) : (
							<LuSendHorizonal className="w-4 h-4" />
						)}
					</Button>
				</form>
			</Form>
		</>
	)
}
