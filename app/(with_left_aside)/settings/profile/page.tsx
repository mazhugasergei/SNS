import { getAuthId } from "@/actions/getAuthId"
import ProfileForm from "./components/ProfileForm"
import { redirect } from "next/navigation"
import User from "@/models/User"

export default async () => {
	const authId = await getAuthId()
	if (!authId) redirect("/settings/appearance")

	const user = await User.findById(authId).lean()
	if (!user) throw "User not found"

	return <ProfileForm {...{ user }} />
}
