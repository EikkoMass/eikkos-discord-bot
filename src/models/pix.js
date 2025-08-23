import { Schema, model } from 'mongoose';

const pixSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  guildId: {
    type: String,
    required: true
  },
  key: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  }
});

export default model('Pix', pixSchema);