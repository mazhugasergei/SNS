import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BsPersonFill } from "react-icons/bs"

export const UserAvatar = ({ src, className }: { src?: string | null; className?: string }) => {
	return (
		<Avatar className={`${className}`}>
			<AvatarImage src={src || ""} style={{ objectFit: "cover" }} />
			<AvatarFallback>
				<BsPersonFill className="opacity-[.5] w-[50%] h-[50%]" />
			</AvatarFallback>
		</Avatar>
	)
}
