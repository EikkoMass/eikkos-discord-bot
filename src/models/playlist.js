import { Schema, model } from "mongoose";

const sc = new Schema({
  userId: {
    type: String,
    required: true,
  },
  guildId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  creationDate: {
    type: Date,
    required: true,
  },
});

export default model("Playlist", sc);
