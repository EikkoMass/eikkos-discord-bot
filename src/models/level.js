import { Schema, model } from 'mongoose';

const levelSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  guildId: {
    type: String,
    required: true
  },
  xp: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 0
  }
});

export default model('Level', levelSchema)