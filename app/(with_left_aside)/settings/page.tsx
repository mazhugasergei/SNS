import { getAuthId } from "@/actions/getAuthId"
import { redirect } from "next/navigation"

export default async () => {
	const authId = await getAuthId()
	if (authId) redirect("/settings/profile")
	else redirect("/settings/appearance")
}
