import { User } from "@/models/User"
import { redirect } from "next/navigation"

export default async ({ searchParams }: { searchParams: { _id: string, code: string } }) => {
  const { _id, code } = searchParams

  await (async ()=>{
    const user = await User.findById(_id)
    if(!user) throw ""
    if(user.verification_code !== code) throw ""
    await user.updateOne({ $unset: { verification_code: 1, expires: 1 } })
  })()
    .catch(() => redirect("/"))
  
  return <>
    <h1 className="text-4xl font-bold tracking-tight mb-2">Verified successfully!</h1>
    <p className="text-sm font-medium">Thanks for verifying your email.</p>
  </>
}