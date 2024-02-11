import { redirect } from "next/navigation"
import { FormClientComponent } from "./components/FormClientComponent"
import { getAuthId } from "@/actions/getAuthId"

export default async () => {
  const authId = await getAuthId()
  if(authId) redirect("/")

  return <FormClientComponent />
}