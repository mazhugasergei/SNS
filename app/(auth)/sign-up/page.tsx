import { redirect } from "next/navigation"
import SignUpForm from "./components/SignUpForm"
import { getAuthId } from "@/actions/getAuthId"

export default async () => {
  const authId = await getAuthId()
  if (authId) redirect("/")

  return <SignUpForm />
}
