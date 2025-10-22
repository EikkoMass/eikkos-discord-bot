import { Schema, model } from "mongoose";

const scheme = new Schema({
  userId: {
    type: String,
    required: true,
  },
  guildId: {
    type: String,
    required: true,
  },
  channelId: {
    type: String,
    required: true,
  },
  messageId: {
    type: String,
    required: true,
  },
  creationDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  fileName: {
    type: String,
  },
  attachment: {
    type: String,
  },
  message: {
    type: String,
  },
  count: {
    type: Number,
    required: true,
  },
});

export default model("Highlight", scheme);
