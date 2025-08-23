import { Schema, model } from 'mongoose';

const noteSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  guildId: {
    type: String,
    required: true,
  },
  type: {
    type: Number,
    required: true,
  },
  creationDate: {
    type: Date,
  },
  img: {
    type: String,
  },
  title: {
    type: String,
    required: false,
  },
  text: {
    type: String,
    required: true,
  },
});

export default model("Note", noteSchema);
