import { getAuthId } from "@/actions/getAuthId"
import { FormClientComponent } from "./components/FormClientComponents"
import { redirect } from "next/navigation"

export default async () => {
  const authId = await getAuthId()
  if(authId) redirect("/")

  return <FormClientComponent />
}