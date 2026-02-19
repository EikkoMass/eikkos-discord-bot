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
  creationDate: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: Number,
    required: true,
    default: 0,
  },
});

export default model("DirtyWord", dirtyWordSchema);
