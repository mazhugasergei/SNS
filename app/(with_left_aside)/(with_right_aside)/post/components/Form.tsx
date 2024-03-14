"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import newPost from "../actions/newPost"
import { useFormError } from "@/hooks/useFormError"
import getUsername from "../actions/getUsername"
import { redirect } from "next/navigation"

const formSchema = z.object({
  body: z.string().min(1).max(300),
})

export default () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      body: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { body } = values
    const username = await getUsername()
    await newPost({ body })
      .then((postId) => (window.location.href = `/${username}/${postId}`))
      .catch((err) => useFormError(form, err, onSubmit))
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea placeholder="New post..." {...field} className="min-h-[10rem] max-h-[30rem]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
