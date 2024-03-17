import Posts from "@/components/Posts"
import PostComponent from "@/components/Post"

export default async ({ params }: { params: { username: string; postId: string } }) => {
	const { postId } = params
	return (
		<>
			<PostComponent {...{ postId }} />
			<Posts parentId={postId} />
		</>
	)
}
