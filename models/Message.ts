import { Schema, Types, model, models } from "mongoose"

delete models["message"]

export default model(
	"message",
	new Schema({
		_id: {
			type: String,
			required: true,
			default: new Types.ObjectId().toString(),
		},
		senderId: {
			type: String,
			required: true,
		},
		chatId: {
			type: String,
			required: true,
		},
		body: {
			type: String,
			required: true,
		},
		parentId: String,
		edited: String,
		created: {
			type: Date,
			default: Date.now,
		},
	})
)
