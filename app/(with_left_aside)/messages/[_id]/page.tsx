import { UserAvatar } from "../../(with_right_aside)/components/UserAvatar"
import Link from "next/link"
import { getAuthId } from "@/actions/getAuthId"
import { redirect } from "next/navigation"
import { MessageInput } from "./components/MessageInput"
import { User } from "@/models/User"
import { Chats } from "../components/Chats"
import { Button } from "@/components/ui/button"
import { LuChevronLeft } from "react-icons/lu"

export default async ({ params }: { params: { _id: string } }) => {
	const authId = await getAuthId()
	if (!authId) redirect("/log-in")
	const auth_pfp = (await User.findById(authId, "pfp"))?.pfp

	const chat = await (async () => {
		const chats = (await User.findById(authId, "chats"))?.chats
		if (!chats) throw "Can't get chats"
		const chat = chats.find((chat) => chat._id.toString() === params._id)
		if (!chat) throw "Can't get the chat"

		const chatName =
			chat.name || (await User.find({ _id: chat.participants }, "fullname")).map((item) => item.fullname).join(", ")

		const chatImage =
			chat.participants.length > 1
				? chat.image || ""
				: await User.findById(chat.participants[0], "pfp").then((res) => res?.pfp)

		return {
			_id: chat._id,
			name: chatName,
			image: chatImage
		}
	})()
	if (!chat) return <>404 not found</>

	const getMessages = async () => {
		const chats = (await User.findById(authId, "chats"))?.chats
		if (!chats) throw "Can't get chats"
		const chat = chats.find((chat) => chat._id.toString() === params._id)
		if (!chat) throw "Can't get the chat"
		return chat.messages
	}
	let messages = await getMessages()

	User.watch().on("change", async (data) => {
		console.log(data.updateDescription.updatedFields)
	})

	return (
		<>
			<Chats className="max-lg:hidden" />
			<div className="flex flex-col h-full border-x">
				{/* header */}
				<div className="flex gap-1.5 border-b p-4 max-lg:pl-2">
					<Link
						href="/messages"
						className="lg:hidden cursor-pointer hover:bg-accent text-center text-sm font-medium rounded-md transition p-2"
					>
						<LuChevronLeft />
					</Link>
					<div className="flex items-center gap-2">
						<div className="rounded-full">
							<UserAvatar src={chat.image} className="w-7 h-7" />
						</div>
						<div className="line-clamp-1 text-xs font-medium">{chat.name}</div>
					</div>
				</div>
				{/* body */}
				<div className="flex-1 px-4">
					{messages.map((message, i) => {
						const recent =
							i &&
							message.sender === messages[i - 1].sender &&
							message.createdAt.getTime() - messages[i - 1].createdAt.getTime() < 300000
						const showDate = !i || message.createdAt.getTime() - messages[i - 1].createdAt.getTime() >= 86400000
						return (
							<div className="flex flex-col" key={message._id?.toString()}>
								{showDate && (
									<div className="self-center text-xs font-medium text-center opacity-75 mt-2 mx-auto bg-secondary rounded-sm px-2 py-1">
										{new Date(message.createdAt.getTime()).toLocaleDateString("default", {
											month: "long",
											day: "2-digit"
										})}
									</div>
								)}
								{/* message */}
								<div
									className={`group flex items-center gap-2 ${
										!message.sender ? "flex-row-reverse self-end" : "self-start"
									} ${recent ? "mt-1" : "mt-2"}`}
								>
									{/* pfp */}
									{recent ? (
										<div className="w-7 h-7" />
									) : (
										<Link href={`/`} className="rounded-full hover:brightness-[.85] transition">
											<UserAvatar src={!message.sender ? auth_pfp : chat.image || ""} className="w-7 h-7" />
										</Link>
									)}
									{/* body */}
									<div className="justify-self-start text-xs bg-secondary rounded-md p-2">{message.body}</div>
									{/* time */}
									<div className="cursor-default self-end text-[.5rem] opacity-0 group-hover:opacity-80 transition">
										{new Date(message.createdAt.getTime()).toLocaleTimeString("en-UK", {
											hour: "2-digit",
											minute: "2-digit"
										})}
									</div>
								</div>
							</div>
						)
					})}
				</div>
				{/* input */}
				<MessageInput chat_id={params._id.toString()} />
			</div>
		</>
	)
}
