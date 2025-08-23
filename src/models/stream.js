import { Schema, model } from 'mongoose';

const streamScheme = new Schema({
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

export default model('Stream', streamScheme);