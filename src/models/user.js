import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  guildId: {
    type: String,
    required: true
  },
  balance: {
    type: Number,
    default: 0
  },
  lastDaily: {
    type: Date,
    required: true
  }
});

export default model('user', userSchema);