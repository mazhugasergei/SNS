"use server"
import { getAuthId } from "@/actions/getAuthId"
import { User } from "@/models/User"

export const sendMessage = async (chatId: string, message: string) => {
  const authId = await getAuthId()
  if(!authId) throw ""

  const chat = await User.findById(authId)
    .then(user => user?.chats.find(chat => chat._id?.toString() === chatId))
  if(!chat) throw ""

  const participants = [authId.toString(), ...chat.participants.filter(_id => _id !== authId.toString())]

  // update the chats
  participants.forEach(async (participantId) => {
    const chatExists = await User.findOne({ _id: participantId, 'chats._id': chatId }, "_id")
    // create the chat for those who doesn't have it
    if(!chatExists){
      const currUser = await User.findById(participantId)
      if(!currUser) throw ""
      // group chat
      if(participants.length > 2){
        currUser.chats.push({
          _id: chat._id,
          name: chat.name,
          image: chat.image,
          participants: participants.filter(_id => _id !== participantId)
        })
        await currUser.save()
      }
      // 1:1 chat
      else{
        const friend = await User.findById(participants.find(_id => _id !== participantId))
        if(!friend) throw ""
        currUser.chats.push({
          _id: chat._id,
          name: friend.fullname,
          image: friend.pfp,
          participants: [friend._id.toString()]
        })
        await currUser.save()
      }
    }
    // send the message to everyone
    await User.updateOne(
      { _id: participantId, "chats._id": chatId },
      { 
        $set: {
          "chats.$.lastMessage": message,
          "chats.$.lastMessageTime": Date.now()
        },
        $push: {
          "chats.$.messages": {
            sender: participantId === authId.toString() ? undefined : participantId,
            body: message
          }
        }
      }
    )
  })
  
  return { ok: true }
}