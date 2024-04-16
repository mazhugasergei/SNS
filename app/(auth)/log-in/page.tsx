import { getAuthId } from "@/actions/getAuthId"
import LogInForm from "./components/LogInForm"
import { redirect } from "next/navigation"

export default async () => {
  const authId = await getAuthId()
  if (authId) redirect("/")

  return <LogInForm />
}
