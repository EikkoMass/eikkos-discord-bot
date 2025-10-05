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
  message: {
    type: String,
  },
  receiverId: {
    type: String,
  },
  creationDate: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  locale: {
    type: String,
    required: true,
  },
});

export default model("Reminder", scheme);
