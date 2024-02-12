import { getAuthId } from "@/actions/getAuthId"
import AccountForm from "./components/AccountForm"
import DeleteAccountDialog from "./components/DeleteAccountDialog"
import { redirect } from "next/navigation"

export default async () => {
	const authId = await getAuthId()
	if (!authId) redirect("/log-in")

	return (
		<>
			<AccountForm {...{ authId }} />
			<DeleteAccountDialog {...{ authId }} />
		</>
	)
}
