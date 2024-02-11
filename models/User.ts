import { Schema, model, models } from "mongoose"

delete models["user"]

export default model(
	"user",
	new Schema({
		username: {
			type: String,
			required: true
		},
		email: {
			type: String,
			required: true
		},
		fullname: {
			type: String,
			required: true
		},
		password: String,
		bio: String,
		pfp: String,
		verificationCode: String,
		privateEmail: {
			type: Boolean,
			default: false
		},
		lastUsernameUpdate: Date,
		friends: [String],
		created: {
			type: Date,
			default: Date.now
		},
		expires: {
			type: Date,
			default: Date.now,
			expires: 3600
		}
	})
)
