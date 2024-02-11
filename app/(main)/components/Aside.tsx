import Logo from "@/components/Logo"
import Link from "next/link"
import { getAuthId } from "@/actions/getAuthId"
import { LuPen, LuUser2, LuHome, LuSearch, LuMessageSquare } from "react-icons/lu"
import User from "@/models/User"
import { LuLogIn } from "react-icons/lu"
import { LuSettings } from "react-icons/lu"
import { SearchProvider } from "./SearchProvider/SearchProvider"
import { UserAvatar } from "./UserAvatar"

export const Aside = async () => {
	const authId = await getAuthId()
	const username = (await User.findById(authId, "username"))?.username
	const pfp = (await User.findById(authId, "pfp"))?.pfp

	const buttonStyle = {
		className: `min-h-[2.25rem] flex max-md:justify-center items-center gap-2 hover:bg-accent text-center text-sm font-medium rounded-md transition p-2 md:px-4`
	}

	const iconStyle = {
		style: {
			width: "1rem",
			height: "1rem"
		}
	}

	const titleStyle = {
		className: "max-md:hidden"
	}

	return (
		<aside className="sticky min-h-screen top-0 md:w-1/5 lg:w-1/6 z-49 flex flex-col border-r pb-4 pr-2 md:pr-4">
			<div className="sticky top-4 sm:top-8 mb-2">
				<Logo className="mb-4" />
				<nav className="flex flex-col gap-1">
					<Link href="/" {...buttonStyle}>
						<LuHome {...iconStyle} />
						<span {...titleStyle}>Home</span>
					</Link>

					<Link href={authId ? `/messages` : "/log-in"} {...buttonStyle}>
						<LuMessageSquare {...iconStyle} />
						<span {...titleStyle}>Messages</span>
					</Link>

					<SearchProvider>
						<button {...buttonStyle}>
							<LuSearch {...iconStyle} />
							<span {...titleStyle}>Search</span>
						</button>
					</SearchProvider>

					<Link href={`/${username}` || "/log-in"} {...buttonStyle}>
						<LuUser2 {...iconStyle} />
						<span {...titleStyle}>Profile</span>
					</Link>

					<Link href={`/settings/${authId ? "profile" : "appearance"}`} {...buttonStyle}>
						<LuSettings {...iconStyle} />
						<span {...titleStyle}>Settings</span>
					</Link>

					{authId && (
						<Link
							href="/moment"
							className="min-h-[2.25rem] flex justify-center items-center bg-primary hover:bg-primary/90 text-center text-sm text-primary-foreground font-medium rounded-md shadow transition p-2 md:px-4 mt-1"
						>
							<LuPen className="md:hidden" />
							<span className="max-md:hidden">New Moment</span>
						</Link>
					)}
				</nav>
			</div>
			{/* Profile */}
			<div className="mt-auto">
				{authId ? (
					<Link
						href={`/${username}` || "/log-in"}
						className={`${buttonStyle.className} max-md:rounded-full max-sm:p-0 max-md:mx-auto`}
					>
						<UserAvatar src={pfp} className="w-7 h-7 sm:w-8 sm:h-8" />
						<span {...titleStyle}>Profile</span>
					</Link>
				) : (
					<Link
						href="/log-in"
						className={`min-h-[2.25rem] flex justify-center items-center bg-primary hover:bg-primary/90 text-center text-sm text-primary-foreground font-medium rounded-md shadow transition p-2 md:px-4`}
					>
						<LuLogIn className="md:hidden" />
						<span className="max-md:hidden">Log in</span>
					</Link>
				)}
			</div>
		</aside>
	)
}
