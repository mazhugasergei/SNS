"use client"

import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import zod from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { deleteAccount } from "../actions/deleteAccount"
import { useFormError } from "@/hooks/useFormError"
import { ReloadIcon } from "@radix-ui/react-icons"

const formSchema = zod.object({
	password: zod
		.string()
		.min(8, { message: "Password must be at least 8 characters" })
		.max(50, { message: "Password must contain at most 50 characters" }),
})

export default ({ authId }: { authId: string }) => {
	const form = useForm<zod.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			password: "",
		},
	})

	const onSubmit = async (data: zod.infer<typeof formSchema>) => {
		await deleteAccount(authId, data.password).catch((err) => useFormError(form, err, onSubmit))
	}

	return (
		<Dialog>
			<DialogTrigger id="deleteAccountDialog" className="hidden" />
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Are you absolutely sure?</DialogTitle>
					<DialogDescription>
						This action cannot be undone. This will permanently delete your account and remove your data from our
						servers. The deleted data will not contain chats and messages.
					</DialogDescription>
				</DialogHeader>
				<Button
					type="button"
					variant="destructive"
					onClick={(e) => {
						const btn = e.target as HTMLButtonElement
						btn.parentElement?.querySelector("form.hidden")?.classList.remove("hidden")
						btn.classList.add("hidden")
					}}
				>
					I understand
				</Button>
				<Form {...form}>
					<form className="hidden space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input type="password" placeholder="Password" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button variant="destructive" className="w-full" disabled={form.formState.isSubmitting}>
							{form.formState.isSubmitting && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}Delete permanently
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
