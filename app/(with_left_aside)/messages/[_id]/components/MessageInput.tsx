"use client"
import * as zod from "zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { ReloadIcon } from "@radix-ui/react-icons"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { useFormError } from "@/hooks/useFormError"
import { Textarea } from "@/components/ui/textarea"
import { LuSendHorizonal } from "react-icons/lu"
import { sendMessage } from "../../actions/sendMessage"

const formSchema = zod.object({
	message: zod.string()
})

export const MessageInput = ({ chat_id }: { chat_id: string }) => {
	const form = useForm<zod.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			message: ""
		}
	})

	const onSubmit = async (data: zod.infer<typeof formSchema>) => {
		const { message } = data
		if (!message.length) return

		await sendMessage(chat_id, message)
			.then((res) => res.ok && form.reset())
			.catch((err) => useFormError(form, err, onSubmit))
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-1 border-t p-1">
				<FormField
					control={form.control}
					name="message"
					render={({ field }) => (
						<FormItem className="w-full">
							<FormControl>
								<Textarea placeholder="Message" {...field} className="text-xs resize-none border-0 shadow-none" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button className="h-full" disabled={form.formState.isSubmitting}>
					{form.formState.isSubmitting ? (
						<ReloadIcon className="w-4 h-4 animate-spin" />
					) : (
						<LuSendHorizonal className="w-4 h-4" />
					)}
				</Button>
			</form>
		</Form>
	)
}
