"use client"

import { searchUsers } from "../actions/searchUsers"
import { CommandDialog, CommandInput } from "@/components/ui/command"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { UserAvatar } from "./UserAvatar"

export default ({ multiselect = false, children }: { multiselect?: boolean; children: React.ReactNode }) => {
	const [searchOpen, setSearchOpen] = useState(false)
	const [value, setSearchValue] = useState("")
	const [defaultUsers, setDefaultUsers] = useState<User[]>()
	const [users, setUsers] = useState<User[]>()
	const [pending, setPending] = useState(false)
	let timeout = useRef<NodeJS.Timeout>()
	// multiselect
	const [selectedItems, setSelectedItems] = useState<string[]>([])

	useEffect(() => {
		// getting default users
		setPending(true)
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

	const styles = {
		category: `text-muted-foreground text-xs px-2 py-1.5`,
		item: `cursor-pointer select-none flex items-center gap-2 text-sm rounded-sm hover:bg-accent p-2`,
	}

	const handleItemClick = (selectedItem: User) => {
		if (multiselect) {
			if (selectedItems.includes(selectedItem._id)) {
				setSelectedItems(selectedItems.filter((item) => item !== selectedItem._id))
			} else {
				setSelectedItems([selectedItem._id, ...selectedItems])
			}
		} else {
			setSearchOpen(false)
			window.location.href = `/${selectedItem.username}`
		}
	}

	////
	useEffect(() => {
		console.log(selectedItems)
	}, [selectedItems])

	return (
		<>
			<div className="grid" onClick={() => setSearchOpen(!searchOpen)}>
				{children}
			</div>
			<CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
				<CommandInput placeholder="Type to search..." onValueChange={setSearchValue} />
				<div className="px-2 py-1">
					{/* Loading... */}
					{pending && <p className="text-center">loading...</p>}

					{/* No value */}
					{!pending && !value && defaultUsers && (
						<>
							<p className={styles.category}>People</p>
							{defaultUsers.map((user) => (
								<div className={styles.item} onClick={() => handleItemClick(user)} key={user.username}>
									<UserAvatar src={user.pfp} className="w-7 h-7" selected={selectedItems.includes(user._id)} />
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
									<UserAvatar src={user.pfp || ""} className="w-7 h-7" />
									{user.fullname}
									<span className="opacity-[.7] text-xs">{user.username}</span>
								</div>
							))}
						</>
					)}
				</div>
			</CommandDialog>
		</>
	)
}
