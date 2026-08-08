import { Schema, model } from 'mongoose';

const scheme = new Schema({
  title: {
    type: String
  },
  link: {
    type: String,
    required: true
  },
  priority: {
    type: Boolean
  }
});

export default model('Status', scheme);
