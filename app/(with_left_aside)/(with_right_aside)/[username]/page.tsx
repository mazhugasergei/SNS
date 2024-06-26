import { UserAvatar } from "@/components/UserAvatar"
import { LuCalendarDays, LuMail } from "react-icons/lu"
import { Banner } from "@/components/Banner"
import User from "@/models/User"
import { getAuthId } from "@/actions/getAuthId"
import Posts from "@/components/Posts"
import Follow from "@/components/Follow"

export const generateMetadata = async ({ params }: { params: { username: string } }) => {
  const user = await User.findOne({ username: params.username })
  if (!user)
    return {
      title: "User not found - Wave",
    }

  const { fullname, username } = user
  return {
    title: `${user && `${fullname} (@${username}) - `}Wave`,
  }
}

export default async ({ params }: { params: { username: string } }) => {
  const authId = await getAuthId()
  const user = await User.findOne({ username: params.username })
  if (!user) return <>user not found</>
  const followers = (await User.find({ following: user._id })).length

  return (
    <>
      {/* profile details */}
      <div className="contianer border-b">
        <div className="px-5 sm:px-8">
          <Banner src={user.banner} />
        </div>
        <div className="px-5 pb-3 sm:px-8 sm:pb-6">
          <div className="flex justify-between">
            <UserAvatar
              src={user.pfp}
              className="w-[20vw] h-[20vw] sm:w-[8.40625rem] sm:h-[8.40625rem] border-4 border-background mb-3 ml-2 md:ml-4 -mt-[calc(20vw/2)] md:-mt-[4.203125rem]"
            />
            <Follow {...{ authId, user }} className="mt-2" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold">{user.fullname}</p>
          <p className="opacity-70 text-sm">@{user.username}</p>
          <p className="text-sm my-1">{user.bio}</p>
          {!user.privateEmail && (
            <a
              href={`mailto:${user.email}`}
              className="inline-flex items-center gap-1 text-sm hover:underline opacity-70"
            >
              <LuMail />
              <span className="break-all">{user.email}</span>
            </a>
          )}
          {user.created && (
            <p className="flex items-center gap-1 opacity-70 text-sm">
              <LuCalendarDays /> Joined{" "}
              {new Date(user.created).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </p>
          )}

          <div className="text-sm mt-2">
            <span className="font-bold">{followers}</span> <span className="opacity-70">Followers</span>
          </div>
        </div>
      </div>

      {/* posts */}
      <Posts authorId={[user._id]} {...{ authId }} />
    </>
  )
}
