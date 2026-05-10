import { Schema, model } from "mongoose";

const name = "NotifyAlias";
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
    default: Date.now,
  },
  notificationId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  type: {
    type: Number,
    required: true,
  },
});

export default model(name, schema);
