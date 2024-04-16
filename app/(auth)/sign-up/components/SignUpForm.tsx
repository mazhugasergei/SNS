"use client"

import zod from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { signUp } from "../actions/signUp"
import { ReloadIcon } from "@radix-ui/react-icons"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useFormError } from "@/hooks/useFormError"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

const formSchema = zod.object({
  email: zod
    .string()
    .min(3, { message: "Email must be at least 3 characters" })
    .max(50, { message: "Email must contain at most 50 characters" }),
  username: zod
    .string()
    .min(2, { message: "Username must be at least 2 characters" })
    .max(50, { message: "Username must contain at most 50 characters" })
    .refine(
      (value) =>
        value !== "log-in" &&
        value !== "sign-up" &&
        value !== "verification" &&
        value !== "messages" &&
        value !== "settings" &&
        value !== "post" &&
        !value.includes("/"),
      { message: "Invalid username" }
    ),
  password: zod
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(50, { message: "Password must contain at most 50 characters" }),
  fullname: zod
    .string()
    .min(2, { message: "Fullname must be at least 2 characters" })
    .max(50, { message: "Fullname must contain at most 50 characters" }),
})

export default function SignUpForm() {
  const router = useRouter()

  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      fullname: "",
    },
  })

  const onSubmit = async (data: zod.infer<typeof formSchema>) => {
    await signUp(data)
      .then(({ ok }) => {
        if (ok) {
          form.reset() // clear the form
          router.push("/log-in")
          toast({
            title: "Verification email sent ✉️",
            description: "Please verify your email address before logging in.",
            duration: 10000,
          }) // show toast
        }
      })
      .catch((err) => useFormError(form, err, onSubmit))
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col max-w-sm space-y-2 mx-auto">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Create an account</h1>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="johnsmith@example.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="johnsmith" {...field} />
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
        <FormField
          control={form.control}
          name="fullname"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Smith" {...field} />
              </FormControl>
              <FormDescription>This is your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}Create account
        </Button>
        <FormDescription className="text-center text-text">
          Already have an account?{" "}
          <Link href="/log-in" className="font-bold underline">
            Log in
          </Link>
        </FormDescription>
      </form>
    </Form>
  )
}
