"use client"

import Link from "next/link"
import { UserAvatar } from "../app/(with_left_aside)/components/UserAvatar"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Button, buttonVariants } from "@/components/ui/button"
import { getAuthId } from "@/actions/getAuthId"
import { useEffect, useState } from "react"

interface IUser {
	_id: string
	username: string
	fullname: string
	pfp?: string | null
	bio?: string | null
}

export default ({ user, children }: { user: IUser; children: React.ReactNode }) => {
	const [authId, setAuthId] = useState<string | null>()

	useEffect(() => {
		getAuthId().then((data) => setAuthId(data))
	}, [])

	return (
		<HoverCard>
			<HoverCardTrigger asChild>{children}</HoverCardTrigger>
			<HoverCardContent className="relative w-80">
				{!authId && (
					<Link href="/log-in" className={`${buttonVariants()} absolute top-4 right-4`}>
						Follow
					</Link>
				)}
				{authId !== user._id && <Button className="absolute top-4 right-4">Follow</Button>}
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
