"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import zod from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "next-themes"

export default () => {
  const { theme, setTheme } = useTheme()

  const FormSchema = zod.object({
    darkTheme: zod.boolean(),
  })

  const form = useForm<zod.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      darkTheme: theme === "dark" ? true : false,
    },
  })

  return (
    <Form {...form}>
      <form className="space-y-6">
        <FormField
          control={form.control}
          name="darkTheme"
          render={({ field }) => {
            return (
              <FormItem
                className="flex items-center justify-between rounded-lg border p-3 shadow-sm"
                onChange={() => setTheme(field.value ? "dark" : "light")}
              >
                <div className="space-y-0.5">
                  <FormLabel>Dark theme</FormLabel>
                  <FormDescription>Make the interface appear in dark colors.</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )
          }}
        />
      </form>
    </Form>
  )
}
