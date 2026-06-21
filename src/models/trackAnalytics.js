import { Schema, model } from "mongoose";

const name = "TrackAnalytics";
const schema = new Schema({
  trackId: {
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
  lastUser: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    default: 1,
  },
});

export default model(name, schema);
