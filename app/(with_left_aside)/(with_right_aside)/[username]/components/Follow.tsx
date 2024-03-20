"use client"

import followUser from "@/actions/followUser"
import { Button, buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"

interface IUser {
	_id: string
	following: string[]
}

export default ({ authUser, user }: { authUser: IUser | null; user: IUser }) => {
	const [following, setFollowing] = useState(authUser && authUser.following.includes(user._id) ? true : false)

	const follow = () => {
		if (!authUser) return
		setFollowing((prev) => !prev)
		followUser({ authId: authUser._id, userId: user._id, follow: !following })
	}

	return authUser ? (
		<Button onClick={follow} variant={following ? "outline" : "default"} className="mt-2">
			{following ? "Following" : "Follow"}
		</Button>
	) : (
		<Link href="/log-in" className={`mt-2 ${buttonVariants()}`}>
			Follow
		</Link>
	)
}
