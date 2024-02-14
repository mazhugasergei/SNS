"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import zod from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ReloadIcon } from "@radix-ui/react-icons"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { UserAvatar } from "@/app/(with_left_aside)/components/UserAvatar"
import { updateProfile } from "../actions/updateProfile"
import { LuCalendarDays, LuMail } from "react-icons/lu"
import { useFormError } from "@/hooks/useFormError"
import { useState } from "react"
import { useChangesSuccess } from "../../hooks/useChangesSuccess"
import { Banner } from "@/app/(with_left_aside)/components/Banner"

interface IUser {
	_id: string
	email: string
	username: string
	fullname: string
	bio?: string | null
	banner?: string | null
	pfp?: string | null
	privateEmail: boolean
	created: Date
}

export default ({ user }: { user: IUser }) => {
	const { _id, email, username, fullname, bio, banner, pfp, privateEmail, created } = user
	const [newPFP, setNewPFP] = useState<string | null | undefined>(pfp)
	const [newBanner, setNewBanner] = useState<string | null | undefined>(banner)

	const formSchema = zod.object({
		pfp: zod.string().optional(),
		banner: zod.string().optional(),
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
		fullname: zod
			.string()
			.min(2, { message: "Fullname must be at least 2 characters" })
			.max(50, { message: "Fullname must contain at most 50 characters" }),
		bio: zod.string().max(160, { message: "Bio must contain at most 160 characters" }).optional(),
		privateEmail: zod.boolean(),
	})

	const form = useForm<zod.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			fullname: fullname || "",
			username: username || "",
			bio: bio || "",
			email: email || "",
			privateEmail,
		},
	})

	const resizeImage = (base64: string, targetWidth: number, targetHeight: number): Promise<string> => {
		return new Promise((resolve, reject) => {
			const img = new Image()
			img.src = base64
			img.onload = () => {
				const aspectRatio = img.width / img.height
				let x, y, width, height
				if (aspectRatio > targetWidth / targetHeight) {
					// image is wider than the target aspect ratio
					width = img.height * (targetWidth / targetHeight)
					height = img.height
					x = (img.width - width) / 2
					y = 0
				} else {
					// image is taller than the target aspect ratio
					width = img.width
					height = img.width * (targetHeight / targetWidth)
					x = 0
					y = (img.height - height) / 2
				}
				const canvas = document.createElement("canvas")
				canvas.width = targetWidth
				canvas.height = targetHeight
				const ctx = canvas.getContext("2d")
				ctx?.drawImage(img, x, y, width, height, 0, 0, targetWidth, targetHeight)
				resolve(canvas.toDataURL("image/jpeg"))
			}
			img.onerror = (error) => reject(error)
		})
	}

	const getImg = (file: File, width: number, height?: number): Promise<string> => {
		// read file
		const reader = new FileReader()
		reader.readAsDataURL(file)
		// return base64
		return new Promise((resolve, reject) => {
			reader.onload = async () => {
				try {
					// resize size
					const result = await resizeImage(String(reader.result), width, height || width)
					resolve(result)
				} catch (error) {
					reject(error)
				}
			}
		})
	}

	const handlePFPChange = async (file: File) => {
		const img = await getImg(file, 400)
		setNewPFP(img)
	}
	const handleBannerChange = async (file: File) => {
		const img = await getImg(file, 1500, 500)
		setNewBanner(img)
	}

	const onSubmit = async (data: zod.infer<typeof formSchema>) => {
		await updateProfile(_id, { _id, created, ...data, pfp: newPFP, banner: newBanner })
			.then((res) => res.ok && useChangesSuccess())
			.catch((err) => useFormError(form, err, onSubmit))
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				{/* public view */}
				<div className="contianer relative border rounded-xl shadow-sm p-2 pb-6 sm:p-4 sm:pb-8">
					<Banner src={newBanner} />
					<div className="px-6 sm:px-12">
						<UserAvatar
							src={newPFP}
							className="w-[20vw] h-[20vw] sm:w-[8.40625rem] sm:h-[8.40625rem] border-4 border-background mb-3 -mt-[calc(20vw/2)] md:-mt-[4.203125rem]"
						/>
						<p className="text-2xl sm:text-3xl font-bold">
							{form.watch("fullname") !== undefined ? form.watch("fullname") : fullname}
						</p>
						<p className="opacity-70 text-sm">
							@{form.watch("username") !== undefined ? form.watch("username") : username}
						</p>
						<p className="text-sm my-1">{form.watch("bio") !== undefined ? form.watch("bio") : bio}</p>
						{!(form.watch("privateEmail") !== undefined ? form.watch("privateEmail") : privateEmail) && (
							<a
								href={`mailto:${form.watch("email") !== undefined ? form.watch("email") : email}`}
								className="inline-flex items-center gap-1 text-sm hover:underline opacity-70"
							>
								<LuMail />
								<span className="break-all">
									{form.getValues("email") !== undefined ? form.getValues("email") : email}
								</span>
							</a>
						)}
						{created && (
							<p className="flex items-center gap-1 opacity-70 text-sm">
								<LuCalendarDays /> Joined on{" "}
								{new Date(created).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
							</p>
						)}
					</div>
				</div>

				{/* settings */}
				<div className="space-y-4">
					{/* pfp */}
					<FormField
						control={form.control}
						name="pfp"
						defaultValue=""
						render={({ field }) => (
							<FormItem>
								<FormLabel>Profile picture</FormLabel>
								<FormControl>
									<div className="flex flex-wrap gap-2">
										<UserAvatar src={newPFP} className="w-[2.25rem] h-[2.25rem]" />
										<Input
											id="pfpInput"
											className="hidden"
											type="file"
											{...field}
											onChange={(e) => e.target.files && handlePFPChange(e.target.files[0])}
										/>
										<Button
											type="button"
											variant="outline"
											onClick={() => document.getElementById("pfpInput")?.click()}
										>
											Choose picture
										</Button>
										<Button type="button" variant="outline" onClick={() => setNewPFP(null)}>
											Remove picture
										</Button>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{/* banner */}
					<FormField
						control={form.control}
						name="banner"
						defaultValue=""
						render={({ field }) => (
							<FormItem>
								<FormLabel>Banner</FormLabel>
								<FormControl>
									<div className="flex flex-wrap gap-2">
										<div className="w-[6.7501201089rem]">
											<Banner src={newBanner} className="rounded-sm" />
										</div>
										<Input
											id="bannerInput"
											className="hidden"
											type="file"
											{...field}
											onChange={(e) => e.target.files && handleBannerChange(e.target.files[0])}
										/>
										<Button
											type="button"
											variant="outline"
											onClick={() => document.getElementById("bannerInput")?.click()}
										>
											Choose picture
										</Button>
										<Button type="button" variant="outline" onClick={() => setNewBanner(null)}>
											Remove picture
										</Button>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{/* fullname */}
					<FormField
						control={form.control}
						name="fullname"
						render={({ field }) => {
							return (
								<FormItem>
									<FormLabel>Fullname</FormLabel>
									<FormControl>
										<Input placeholder="John Smith" {...field} />
									</FormControl>
									<FormDescription>This is your public display name.</FormDescription>
									<FormMessage />
								</FormItem>
							)
						}}
					/>
					{/* username */}
					<FormField
						control={form.control}
						name="username"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Username</FormLabel>
								<FormControl>
									<Input placeholder="johnsmith" type="username" {...field} />
								</FormControl>
								<FormDescription>You can only change this once every 30 days.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					{/* bio */}
					<FormField
						control={form.control}
						name="bio"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Bio</FormLabel>
								<FormControl>
									<Textarea placeholder="Tell us a little about yourself (optional)." {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{/* email */}
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input placeholder="johnsmith@example.com" type="email" {...field} />
								</FormControl>
								<FormMessage>{form.formState.errors.email?.message}</FormMessage>
							</FormItem>
						)}
					/>
					{/* privateEmail */}
					<FormField
						control={form.control}
						name="privateEmail"
						render={({ field }) => (
							<FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
								<div className="space-y-0.5">
									<FormLabel>Hide email</FormLabel>
									<FormDescription>Hide your email address from public view.</FormDescription>
								</div>
								<FormControl>
									<Switch checked={field.value} onCheckedChange={field.onChange} />
								</FormControl>
							</FormItem>
						)}
					/>
				</div>
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
			</form>
		</Form>
	)
}
