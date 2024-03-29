import { Schema, Types, model, models } from "mongoose"

delete models["chat"]

export default model(
	"chat",
	new Schema({
		_id: {
			type: String,
			required: true,
			default: new Types.ObjectId().toString(),
		},
		name: String,
		image: String,
		participants: {
			type: [String],
			required: true,
		},
		lastMessage: String,
		lastMessageTime: Date,
		created: {
			type: Date,
			default: Date.now,
		},
	})
)
