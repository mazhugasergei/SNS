import Logo from "@/components/Logo"
import Link from "next/link"
import { getAuthId } from "@/actions/getAuthId"
import { LuPen, LuUser2, LuHome, LuSearch, LuMessageSquare } from "react-icons/lu"
import User from "@/models/User"
import { LuLogIn } from "react-icons/lu"
import { LuSettings } from "react-icons/lu"
import UsersSearchProvider from "@/components/UsersSearchProvider"
import { UserAvatar } from "@/components/UserAvatar"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Button, buttonVariants } from "@/components/ui/button"
import PostForm from "@/components/PostForm"

export const Aside = async () => {
	const authId = await getAuthId()
	const username = (await User.findById(authId, "username"))?.username
	const pfp = (await User.findById(authId, "pfp"))?.pfp

	const buttonStyle = {
		className: `${buttonVariants({
			variant: "ghost",
			size: "default",
		})} flex justify-center md:justify-start items-center gap-2`,
	}

	const iconStyle = {
		style: {
			width: "1rem",
			height: "1rem",
		},
	}

	const titleStyle = {
		className: "max-md:hidden",
	}

	return (
		<aside className="sticky min-h-screen top-0 md:w-1/5 lg:w-1/6 z-49 flex flex-col border-r pb-4 pr-2 md:pr-4">
			<div className="sticky top-0 pt-4 sm:pt-8 mb-2">
				<Logo className="mb-4" />
				<nav className="grid gap-1">
					<Link href="/" {...buttonStyle}>
						<LuHome {...iconStyle} />
						<span {...titleStyle}>Home</span>
					</Link>

					<Link href={authId ? `/messages` : "/log-in"} {...buttonStyle}>
						<LuMessageSquare {...iconStyle} />
						<span {...titleStyle}>Messages</span>
					</Link>

					<UsersSearchProvider>
						<button {...buttonStyle}>
							<LuSearch {...iconStyle} />
							<span {...titleStyle}>Search</span>
						</button>
					</UsersSearchProvider>

					<Link href={`/${username ?? "log-in"}`} {...buttonStyle}>
						<LuUser2 {...iconStyle} />
						<span {...titleStyle}>Profile</span>
					</Link>

					<Link href={`/settings/${authId ? "profile" : "appearance"}`} {...buttonStyle}>
						<LuSettings {...iconStyle} />
						<span {...titleStyle}>Settings</span>
					</Link>

					{authId && (
						<Dialog>
							<DialogTrigger className={`mt-1 ${buttonVariants()}`}>
								<LuPen className="md:hidden" />
								<span className="max-md:hidden">New Post</span>
							</DialogTrigger>
							<DialogContent className="pt-4 px-0 pb-0">
								<PostForm />
							</DialogContent>
						</Dialog>
					)}
				</nav>
			</div>

			{/* Profile */}
			<div className="grid mt-auto">
				{!authId && (
					<Link href="/log-in" className={`${buttonVariants({ variant: "default" })}`}>
						<LuLogIn className="md:hidden" />
						<span className="max-md:hidden">Log in</span>
					</Link>
				)}
			</div>
		</aside>
	)
}
