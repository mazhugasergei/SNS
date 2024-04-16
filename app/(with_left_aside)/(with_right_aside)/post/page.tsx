import { getAuthId } from "@/actions/getAuthId"
import PostForm from "@/components/PostForm"
import { redirect } from "next/navigation"

export default async () => {
  const authId = await getAuthId()
  if (!authId) redirect("/")

  return <PostForm />
}
