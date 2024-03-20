import { getAuthId } from "@/actions/getAuthId"
import Posts from "@/components/Posts"
import User from "@/models/User"

export default async () => {
	const authId = await getAuthId()
	const authUser = await User.findById(authId).then((data) => JSON.parse(JSON.stringify(data)))
	const authorId: string[] = []
	if (authId && authUser) {
		authorId.push(authId)
		authorId.push(...authUser.following)
	}

	return (
		<>
			<Posts {...{ authorId }} />
		</>
	)
}
