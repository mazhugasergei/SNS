import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BsPersonFill } from "react-icons/bs"
import { LuCheck } from "react-icons/lu"

export const UserAvatar = ({
	src = "",
	selected = false,
	className,
}: {
	src?: string | null
	selected?: boolean
	className?: string
}) => {
	return (
		<div className="relative">
			<Avatar className={`${className} ${selected && "shadow-[0_0_0_.125rem] shadow-primary"}`}>
				<AvatarImage src={src || ""} style={{ objectFit: "cover" }} />
				<AvatarFallback>
					<BsPersonFill className="opacity-[.5] w-[50%] h-[50%]" />
				</AvatarFallback>
			</Avatar>
			{selected && (
				<LuCheck className="w-[50%] h-[50%] absolute -bottom-[.2rem] -right-[.2rem] bg-primary rounded-full text-background p-0.5" />
			)}
		</div>
	)
}
