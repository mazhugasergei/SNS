import { getAuthId } from "@/actions/getAuthId"
import Form from "./components/Form"
import { redirect } from "next/navigation"

export default async () => {
  const authId = await getAuthId()
  if (!authId) redirect("/")

  return (
    <>
      <Form />
    </>
  )
}
