import { UseFormReturn } from "react-hook-form"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"

export const useFormError = (form: UseFormReturn<any>, err: Error, onSubmit: (values: any) => Promise<void>) => {
	// server error
	if (err.message.substring(7, 8) !== "[")
		toast({
			variant: "destructive",
			title: "Uh oh! Something went wrong.",
			description: "There was a problem with your request.",
			action: (
				<ToastAction altText="Try again" onClick={form.handleSubmit(onSubmit)}>
					Try again
				</ToastAction>
			)
		})
	// client error
	else {
		const error = err.message.replace("Error: ", "")
		const errType = error.substring(1, error.indexOf("]: "))
		const errMessage = error.substring(error.indexOf("]: ") + 3)
		form.setError(errType as string, { type: "server", message: errMessage })
	}
}
