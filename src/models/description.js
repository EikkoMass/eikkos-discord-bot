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
  targetUserId: {
    type: String,
    required: true,
  },
  message: {
    type: String,
  },
});

export default model("Description", scheme);
