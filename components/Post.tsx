"use client"

import { getAuthId } from "@/actions/getAuthId"
import { useEffect, useState } from "react"

export default ({ postId }: { postId: string }) => {
	const [authId, setAuthId] = useState<string | null>(null)

	useEffect(() => {
		getAuthId().then((data) => setAuthId(data))
	}, [])

	return <div className="border-b"></div>
}
