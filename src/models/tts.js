import { Schema, model } from "mongoose";

const schema = new Schema({
  channelId: {
    type: String,
    required: true,
  },
  guildId: {
    type: String,
    required: true,
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

export default model("tts", schema);
