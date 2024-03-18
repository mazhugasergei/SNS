import Posts from "@/components/Posts"
import PostComponent from "@/components/Post"

export default async ({ params }: { params: { username: string; postId: string } }) => {
	const { username, postId } = params
	return (
		<>
			<PostComponent {...{ username, postId }} />
			<Posts parentId={postId} />
		</>
	)
}
