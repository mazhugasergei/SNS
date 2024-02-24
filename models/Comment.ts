import { Schema, Types, model, models } from "mongoose"

delete models["comment"]

export default model(
	"comment",
	new Schema({
		_id: {
			type: String,
			required: true,
			default: new Types.ObjectId().toString(),
		},
		postId: {
			type: String,
			required: true,
		},
		authorId: {
			type: String,
			required: true,
		},
		body: {
			type: String,
			required: true,
		},

		created: {
			type: Date,
			default: Date.now(),
		},
	})
)
