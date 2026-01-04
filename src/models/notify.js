import { Schema, model } from "mongoose";

const schema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  guildId: {
    type: String,
    required: true,
  },
  creationDate: {
    type: Date,
    required: true,
  },
  expirationDate: {
    type: Date,
  },
  title: {
    type: String,
  },
  message: {
    type: String,
  },
});

export default model("Notify", schema);
