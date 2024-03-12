"use client"

import { ReloadIcon } from "@radix-ui/react-icons"
import { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"
import getComments from "../actions/getComments"

interface IComment {
	_id: string
	postId: string
	authorId: string
	body: string
	created: Date
}

export default ({ postId }: { postId: string }) => {
	const perPage = 1
	const [page, setPage] = useState(0)
	const [comments, setComments] = useState<IComment[]>([])
	const [loading, setLoading] = useState(false)
	const [observerVisible, setObserverVisible] = useState(true)
	const { ref, inView } = useInView({ rootMargin: "200px" })

	// on observer in view
	useEffect(() => {
		if (inView && !loading) {
			setLoading(true)
			const addComments = async () => {
				try {
					const data = await getComments({ postId, limit: perPage, skip: perPage * page })
					if (data.length === 0) {
						setObserverVisible(false)
					} else {
						setComments((prev) => [...prev, ...data])
						setPage((prev) => prev + 1)
					}
				} catch (error) {
					console.error("Error fetching comments:", error)
				} finally {
					setLoading(false)
				}
			}
			addComments()
		}
	}, [inView, loading, page])

	useEffect(() => {
		console.log(comments)
	}, [comments])

	return (
		<>
			comments
			{/* observer */}
			{observerVisible && (
				<div ref={ref} className="min-h-[5rem] grid place-items-center">
					<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
				</div>
			)}
		</>
	)
}
