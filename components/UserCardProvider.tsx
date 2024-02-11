import Link from "next/link"
import { UserAvatar } from "../app/(main)/components/UserAvatar"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Button, buttonVariants } from "@/components/ui/button"
import { getAuthId } from "@/actions/getAuthId"
import User from "@/models/User"

type User = {
	_id: string
	username: string
	fullname: string
	pfp?: string | null
	bio?: string | null
}

export default async ({ user, children }: { user: User; children: React.ReactNode }) => {
	const authId = await getAuthId()

	return (
		<HoverCard>
			<HoverCardTrigger asChild>{children}</HoverCardTrigger>
			<HoverCardContent className="relative w-80">
				{authId ? (
					authId !== user._id && <Button className="absolute top-4 right-4">Follow</Button>
				) : (
					<Link href="/log-in" className={`${buttonVariants()} absolute top-4 right-4`}>
						Follow
					</Link>
				)}
				<div className="space-y-2">
					<Link href={`/${user.username}`} className="inline-block hover:brightness-[.85] transition mb-1">
						<UserAvatar src={user.pfp || ""} />
					</Link>
					<Link href={`/${user.username}`}>
						<div className="text-md font-bold hover:underline">{user.fullname}</div>
						<div className="text-sm opacity-70">@{user.username}</div>
					</Link>
					<div className="text-sm">{user.bio}</div>
				</div>
			</HoverCardContent>
		</HoverCard>
	)
}
