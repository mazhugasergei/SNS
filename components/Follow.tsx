"use client"

import followUser from "@/actions/followUser"
import getUser from "@/actions/getUser"
import { Button, buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"

export default ({ authId, user, className }: { authId?: string | null; user: User; className?: string }) => {
	const [authUser, setAuthUser] = useState<User | null>()
	const [following, setFollowing] = useState(false)

	const follow = () => {
		if (!authUser) return
		setFollowing((prev) => !prev)
		followUser({ authId: authUser._id, userId: user._id, follow: !following })
	}

	useEffect(() => {
		authId && getUser({ _id: authId }).then((data) => setAuthUser(data))
	}, [])

	useEffect(() => {
		authUser && setFollowing(authUser.following.includes(user._id) ? true : false)
	}, [authUser])

	if (authUser === undefined) return
	else if (authUser === null)
		return (
			<Link href="/log-in" className={`${buttonVariants()} ${className}`}>
				Follow
			</Link>
		)
	else if (authUser._id !== user._id)
		return (
			<Button onClick={follow} variant={following ? "outline" : "default"} {...{ className }}>
				{following ? "Following" : "Follow"}
			</Button>
		)
}
