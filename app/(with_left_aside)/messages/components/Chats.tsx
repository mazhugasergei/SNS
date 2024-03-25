import { getAuthId } from "@/actions/getAuthId"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import User from "@/models/User"
import Chat from "@/models/Chat"
import { useFormatDateDifference } from "@/hooks/useFormatDateDifferece"
import UsersSearchProvider from "@/components/UsersSearchProvider"
import { UserAvatar } from "@/components/UserAvatar"

export const Chats = async ({ className }: { className?: string }) => {
	const authId = await getAuthId()
	if (!authId) redirect("/log-in")

	const chats = await (async () => {
		const chats = await Chat.find({ participants: authId })
		const res: Chat[] = []
		for (const chat of chats) {
			// chat name
			const chatName =
				chat.name ||
				(await User.find({ _id: chat.participants }))
					.filter(({ _id }) => _id !== authId)
					.map(({ fullname }) => fullname)
					.join(", ")
			// chat image
			const chatImage =
				chat.participants.length > 2 ? chat.image : await User.findById(chat.participants[1]).then((data) => data?.pfp)
			res.push({
				...JSON.parse(JSON.stringify(chat)),
				name: chatName,
				image: chatImage,
			})
		}
		return res
	})()
	if (!chats) return <>no chats</>

	return (
		<div className={`${className} flex flex-col p-4`}>
			<UsersSearchProvider multiselect>
				<Button className="mb-2">New chat</Button>
			</UsersSearchProvider>
			{chats.map((chat) => {
				return (
					<Link
						href={`/messages/${chat._id}`}
						className="cursor-pointer flex items-center gap-2 text-sm rounded-sm hover:bg-accent px-2 py-2 transition"
						key={chat._id}
					>
						<UserAvatar src={chat.image} className="w-8 h-8" />
						<div className="flex-1">
							<div className="flex items-center">
								<div className="truncate">{chat.name}</div>
								{chat.lastMessageTime && (
									<div className="text-xs opacity-80 whitespace-nowrap">
										 · {useFormatDateDifference(chat.lastMessageTime)}
									</div>
								)}
							</div>
						</div>
					</Link>
				)
			})}
		</div>
	)
}
