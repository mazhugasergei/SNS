import Link from "next/link"
import { HiOutlineArrowLeft } from "react-icons/hi"
import Logo from "@/components/Logo"

export default () => {
	return (
		<header className="absolute top-0 w-full flex justify-between items-center py-4">
			<Logo className="-ml-2 md:-ml-4" />
			{/* <Link href="/" className="flex items-center gap-1.5 text-sm font-semibold"><HiOutlineArrowLeft style={{ strokeWidth: "3" }} /> Go back</Link> */}
		</header>
	)
}
