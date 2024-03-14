import { getAuthId } from "@/actions/getAuthId"
import { UserAvatar } from "@/app/(with_left_aside)/components/UserAvatar"
import UserCardProvider from "@/components/UserCardProvider"
import Comment from "@/models/Comment"
import Post from "@/models/Post"
import User from "@/models/User"
import Link from "next/link"
import PostTools from "./components/PostTools"
import Comments from "./components/Comments"
import { redirect } from "next/navigation"
import Actions from "./components/Actions"

export default async ({ params }: { params: { username: string; postId: string } }) => {
  const authId = await getAuthId()
  const { username, postId } = params
  const user = await User.findOne({ username })
  if (!user) return <>user not found</>
  const post = await (async () => {
    const post = await Post.findById(params.postId)
    const comments = await Comment.find({ postId: params.postId })
    return {
      ...JSON.parse(JSON.stringify(post)),
      comments: comments.length,
    }
  })()
  if (!post) return <>post not found</>

  return (
    <>
      <div className="border-b">
        {/* post */}
        <div className="relative grid grid-cols-[auto_1fr_auto] gap-[.6875rem] items-start border-b text-sm py-2 transition">
          {/* pfp */}
          <UserCardProvider {...{ user }}>
            <Link href={`/${user.username}`} className="rounded-full">
              <UserAvatar src={user.pfp} className="w-9 h-9 hover:brightness-[.92] transition" />
            </Link>
          </UserCardProvider>
          {/* info */}
          <div>
            {/* name */}
            <UserCardProvider {...{ user }}>
              <Link href={`/${user.username}`} className="relative">
                <span className="font-bold hover:underline">{user.fullname}</span>
                <br />
                <span className="opacity-70"> @{user.username}</span>
              </Link>
            </UserCardProvider>

            {/* body */}
            <br />
            <p className="relative inline text-sm">{post.body}</p>
          </div>
          {/* actions */}

          <Actions {...{ postId }} />
        </div>

        <PostTools {...{ authId, postId }} />
      </div>

      <Comments {...{ authId, postId }} />
    </>
  )
}
