"use client"
import { logIn } from "../actions/logIn"
import { useFormError } from "@/hooks/useFormError"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import zod from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ReloadIcon } from "@radix-ui/react-icons"

const formSchema = zod.object({
	email: zod
		.string()
		.min(2, { message: "Username must be at least 2 characters" })
		.max(50, { message: "Username must contain at most 50 characters" }),
	password: zod
		.string()
		.min(8, { message: "Password must be at least 8 characters" })
		.max(50, { message: "Password must contain at most 50 characters" })
})

export const FormClientComponent = () => {
	const form = useForm<zod.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "ghbdtnghbdtn8@gmail.com",
			password: "12345678"
		}
	})

	const onSubmit = async (data: zod.infer<typeof formSchema>) => {
		// generate verification code
		const { email, password } = data
		await logIn(email, password)
			.then((res) => res.ok && form.reset())
			.catch((err) => useFormError(form, err, onSubmit))
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col max-w-sm space-y-2 mx-auto">
				<h1 className="text-4xl font-bold tracking-tight mb-2">Welcome back</h1>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem className="space-y-1">
							<FormLabel>Email or username</FormLabel>
							<FormControl>
								<Input placeholder="johnsmith@example.com" type="email" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem className="space-y-1">
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input placeholder="••••••••" type="password" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button disabled={form.formState.isSubmitting}>
					{form.formState.isSubmitting && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}Log In
				</Button>
				<FormDescription className="text-center text-text">
					Don't have an account?{" "}
					<Link href="/sign-up" className="font-bold underline">
						Sign up
					</Link>
				</FormDescription>
			</form>
		</Form>
	)
}
