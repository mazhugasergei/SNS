import { Schema, Types, model, models } from "mongoose"

delete models["post"]

export default model(
  "post",
  new Schema({
    _id: {
      type: String,
      required: true,
      default: new Types.ObjectId().toString(),
    },
    authorId: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },

    likes: {
      type: [String],
      required: true,
      default: [],
    },

    created: {
      type: Date,
      default: Date.now(),
    },
  })
)
