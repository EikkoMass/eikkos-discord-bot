import { Schema, model } from "mongoose";

const name = "Track";
const schema = new Schema({
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
});

export default model(name, schema);
