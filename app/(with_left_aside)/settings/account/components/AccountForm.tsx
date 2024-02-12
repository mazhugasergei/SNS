"use client"

import zod from "zod"
import { Button, buttonVariants } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ReloadIcon } from "@radix-ui/react-icons"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { updateAccount } from "../actions/updateAccount"
import { useFormError } from "@/hooks/useFormError"
import { Separator } from "@/components/ui/separator"
import { useChangesSuccess } from "../../hooks/useChangesSuccess"

const formSchema = zod
	.object({
		currentPassword: zod
			.string()
			.max(50, { message: "Password must contain at most 50 characters" })
			.refine((value) => value.length === 0 || value.length >= 8, { message: "Password must be at least 8 characters" })
			.optional(),
		newPassword: zod
			.string()
			.max(50, { message: "Password must contain at most 50 characters" })
			.refine((value) => value.length === 0 || value.length >= 8, { message: "Password must be at least 8 characters" })
			.optional(),
		repeatNewPassword: zod.string().optional(),
	})
	.refine((values) => values.newPassword === values.repeatNewPassword, {
		message: "Passwords must match",
		path: ["repeatNewPassword"],
	})

export default ({ authId }: { authId: string }) => {
	const form = useForm<zod.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			repeatNewPassword: "",
		},
	})

	const onSubmit = async (data: zod.infer<typeof formSchema>) => {
		await updateAccount({ _id: authId, ...data })
			.then((res) => res.ok && useChangesSuccess())
			.catch((err) => useFormError(form, err, onSubmit))
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<div className="space-y-4">
					<div>
						<h3 className="text-lg font-medium">Password</h3>
						<p className="text-sm text-muted-foreground mb-4">
							Mind that you will have to log in again when set a new password.
						</p>
						<Separator />
					</div>
					<FormField
						control={form.control}
						name="currentPassword"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Current password</FormLabel>
								<FormControl>
									<Input
										type="password"
										{...field}
										placeholder="••••••••"
										required={Boolean(form.watch("newPassword")?.length)}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="newPassword"
						render={({ field }) => (
							<FormItem>
								<FormLabel>New password</FormLabel>
								<FormControl>
									<Input
										type="password"
										{...field}
										placeholder="••••••••"
										required={Boolean(form.watch("currentPassword")?.length)}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="repeatNewPassword"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Repeat new password</FormLabel>
								<FormControl>
									<Input
										type="password"
										{...field}
										placeholder="••••••••"
										required={Boolean(form.watch("currentPassword")?.length)}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="sticky bottom-0 bg-background rounded-tl-md rounded-tr-md pb-6">
						<Button className="w-full" disabled={form.formState.isSubmitting}>
							{form.formState.isSubmitting ? (
								<>
									<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
									Saving
								</>
							) : (
								"Save changes"
							)}
						</Button>
					</div>

					{/* danger zone */}
					<div className="text-destructive space-y-3 pb-6">
						<Label className="block">Danger zone</Label>
						<Label
							htmlFor="deleteAccountDialog"
							className={`cursor-pointer block text-center ${buttonVariants({ variant: "destructive" })}`}
						>
							Delete account
						</Label>
					</div>
				</div>
			</form>
		</Form>
	)
}
