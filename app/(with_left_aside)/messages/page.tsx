import Image from "next/image"
import { Chats } from "./components/Chats"

export default () => {
	return (
		<>
			<Chats />
			<div className="max-lg:hidden flex justify-center items-center border-x">Select chat</div>
		</>
	)
}
