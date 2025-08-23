import { Schema, model } from 'mongoose';

const dirtyWordSchema = new Schema({
  guildId: {
    type: String,
    required: true,
    unique: true
  },
  word: {
    type: String,
    required: true
  }
});

export default model('DirtyWord', dirtyWordSchema);