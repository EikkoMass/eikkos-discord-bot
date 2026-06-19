import { Schema, model } from "mongoose";

const name = "PlayerAnalytics";
const schema = new Schema({
  lastUser: {
    type: String,
    required: true,
  },
  guildId: {
    type: String,
    required: true,
  },
  firstPlayed: {
    type: Date,
    required: true,
  },
  lastPlayed: {
    type: Date,
    required: true,
    default: Date.now,
  },
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
  },
  amount: {
    type: Number,
    required: true,
    default: 1,
  },
});

export default model(name, schema);
