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
  structure: {
    type: Number,
    required: true,
  },
  creationDate: {
    type: Date,
    required: true,
  },
  expirationDate: {
    type: Date,
  },
  message: {
    type: String,
  },
  reference: {
    type: String,
  },
});

export default model("Notify", schema);
