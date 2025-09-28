import { Schema, model } from "mongoose";

const dirtyWordSchema = new Schema({
  guildId: {
    type: String,
    required: true,
    unique: true,
  },
  word: {
    type: String,
    required: true,
  },
  type: {
    type: Number,
    required: true,
    default: 0,
  },
});

export default model("DirtyWord", dirtyWordSchema);
