"use client"

import { searchUsers } from "../actions/searchUsers"
import { CommandDialog, CommandInput } from "@/components/ui/command"
import { useEffect, useRef, useState } from "react"
import { UserAvatar } from "./UserAvatar"
import { ScrollArea, ScrollBar } from "./ui/scroll-area"
import { Button } from "./ui/button"
import { LuX } from "react-icons/lu"
import createChat from "@/app/(with_left_aside)/messages/actions/createChat"

export default ({ multiselect = false, children }: { multiselect?: boolean; children: React.ReactNode }) => {
	const [searchOpen, setSearchOpen] = useState(false)
	const [value, setSearchValue] = useState("")
	const [defaultUsers, setDefaultUsers] = useState<User[]>()
	const [users, setUsers] = useState<User[]>()
	const [pending, setPending] = useState(true)
	let timeout = useRef<NodeJS.Timeout>()
	// multiselect
	const [selectedItems, setSelectedItems] = useState<User[]>([])

	const styles = {
		category: `text-muted-foreground text-xs px-2 py-1.5`,
		item: `cursor-pointer select-none flex items-center gap-2 text-sm rounded-sm hover:bg-accent p-2`,
	}

	useEffect(() => {
		// getting default users
		searchUsers().then((data) => {
			setDefaultUsers(data)
			setPending(false)
		})
	}, [])

	useEffect(() => {
		// reset search on search close
		if (!searchOpen) {
			setTimeout(() => {
				setSearchValue("")
				setUsers(undefined)
				setSelectedItems([])
				defaultUsers && setPending(false)
				clearTimeout(timeout.current)
			}, 250)
		}
	}, [searchOpen])

	useEffect(() => {
		// search users
		clearTimeout(timeout.current)
		if (value) {
			setPending(true)
			timeout.current = setTimeout(() => {
				searchUsers(value).then((res) => {
					setUsers(res)
					setPending(false)
				})
			}, 200)
		} else {
			setUsers(undefined)
			setPending(false)
		}
	}, [value])

	const handleItemClick = (selectedItem: User) => {
		if (multiselect) {
			if (selectedItems.find(({ _id }) => _id === selectedItem._id)) {
				setSelectedItems(selectedItems.filter(({ _id }) => _id !== selectedItem._id))
			} else {
				setSelectedItems([selectedItem, ...selectedItems])
			}
		} else {
			setSearchOpen(false)
			window.location.href = `/${selectedItem.username}`
		}
	}

	const newChat = () => {
		createChat(selectedItems.map(({ _id }) => _id)).then((chatId) => (window.location.href = `/messages/${chatId}`))
	}

	return (
		<>
			<div className="grid" onClick={() => setSearchOpen(!searchOpen)}>
				{children}
			</div>
			<CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
				<CommandInput placeholder="Type to search..." onValueChange={setSearchValue} />
				{/* results */}
				<div className="px-2 py-1">
					{/* Loading... */}
					{pending && <p className="text-center">loading...</p>}

					{/* No value */}
					{!pending && !value && defaultUsers && (
						<>
							<p className={styles.category}>People</p>
							{defaultUsers.map((user) => (
								<div className={styles.item} onClick={() => handleItemClick(user)} key={user.username}>
									<UserAvatar
										src={user.pfp}
										className="w-7 h-7"
										selected={!!selectedItems.find(({ _id }) => _id === user._id)}
									/>
									{user.fullname}
									<span className="opacity-[.7] text-xs">{user.username}</span>
								</div>
							))}
						</>
					)}

					{/* No results */}
					{!pending && value && !users?.length && <p className="text-center">No results found.</p>}

					{/* Yes results */}
					{!pending && value && !!users?.length && (
						<>
							<p className={styles.category}>People</p>
							{users.map((user) => (
								<div className={styles.item} onClick={() => handleItemClick(user)} key={user.username}>
									<UserAvatar
										src={user.pfp}
										className="w-7 h-7"
										selected={!!selectedItems.find(({ _id }) => _id === user._id)}
									/>
									{user.fullname}
									<span className="opacity-[.7] text-xs">{user.username}</span>
								</div>
							))}
						</>
					)}
				</div>
				{/* selected items & submit */}
				{multiselect && (
					<div className="flex gap-2 border-t p-2">
						<div className="w-full flex flex-wrap gap-2 items-start justify-start">
							{selectedItems.map(({ _id, fullname, pfp }) => (
								<div
									className="cursor-pointer flex gap-2 items-center border hover:bg-secondary rounded-full p-0.5 pr-3"
									onClick={() => setSelectedItems((prev) => prev.filter((item) => item._id !== _id))}
									key={_id}
								>
									<UserAvatar src={pfp} className="w-6 h-6" />
									<div className="text-xs font-medium">{fullname}</div>
									<LuX className="text-sm" />
								</div>
							))}
						</div>
						<Button disabled={!selectedItems.length} onClick={newChat}>
							Next
						</Button>
					</div>
				)}
			</CommandDialog>
		</>
	)
}
