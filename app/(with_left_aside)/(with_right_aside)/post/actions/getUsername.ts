"use server"

import { getAuthId } from "@/actions/getAuthId"
import User from "@/models/User"

export default async () => {
  const authId = await getAuthId()
  if (!authId) throw "Not auth"
  const user = await User.findById(authId)
  if (!user) throw "User not found"
  return user.username
}
