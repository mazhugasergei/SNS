import { Schema, Types, model, models } from "mongoose"

delete models["user"]

export default model(
	"user",
	new Schema({
		_id: {
			type: String,
			required: true,
			default: new Types.ObjectId().toString(),
		},
		username: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		fullname: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		bio: String,
		pfp: String,
		banner: String,
		following: {
			type: [String],
			default: [],
		},
		verificationCode: String,
		privateEmail: {
			type: Boolean,
			default: false,
		},
		lastUsernameUpdate: {
			type: Date,
			default: Date.now,
		},
		friends: [String],
		created: {
			type: Date,
			default: Date.now,
		},
		expires: {
			type: Date,
			default: Date.now,
			expires: 3600,
		},
	})
)
