"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { RxDotsHorizontal } from "react-icons/rx"
import deletePost from "../actions/deletePost"

export default ({ postId }: { postId: string }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="p-2 -m-2">
        <RxDotsHorizontal />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => deletePost(postId).then(() => history.back())}>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
