import { Schema, model } from "mongoose";

const scheme = new Schema({
  guildId: {
    type: String,
    required: true,
  },
  channelId: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    default: 4,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

export default model("HighlightGuild", scheme);
