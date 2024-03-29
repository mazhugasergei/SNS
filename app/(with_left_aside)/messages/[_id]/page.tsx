import Link from "next/link"
import { getAuthId } from "@/actions/getAuthId"
import { redirect } from "next/navigation"
import Messages from "./components/Messages"
import { Chats } from "../components/Chats"
import { LuChevronLeft } from "react-icons/lu"
import User from "@/models/User"
import Chat from "@/models/Chat"
import { UserAvatar } from "@/components/UserAvatar"

export default async ({ params }: { params: { _id: string } }) => {
	const authId = await getAuthId()
	if (!authId) redirect("/log-in")

	const chat = await (async () => {
		const chat = await Chat.findById(params._id)
		if (!chat) throw "Chat not found"

		const chatName =
			chat.name ||
			(await User.find({ _id: chat.participants }))
				.filter(({ _id }) => _id !== authId)
				.map(({ fullname }) => fullname)
				.join(", ")

		const chatImage =
			chat.participants.length > 1
				? chat.image || ""
				: (await User.findById(chat.participants.find((_id) => _id !== authId)))?.pfp

		return {
			_id: chat._id,
			name: chatName,
			image: chatImage,
		}
	})()
	if (!chat) return <>Chat not found</>

	Chat.watch().on("change", async (data) => {
		console.log(data)
	})

	return (
		<>
			<Chats className="max-lg:hidden" chatId={params._id} />
			<div className="flex flex-col h-full lg:border-x">
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

				<Messages chatId={params._id.toString()} />
			</div>
		</>
	)
}
