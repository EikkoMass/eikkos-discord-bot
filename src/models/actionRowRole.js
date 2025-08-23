import { Schema, model } from 'mongoose';

const actionRowRole = new Schema({
  guildId: {
    type: String,
    required: true
  },
  roleId: {
    type: String,
    required: true
  },
  context: {
    type: Schema.Types.ObjectId
  },
  label: {
    type: String,
  },
  style: {
    type: Number
  }
});

export default model('ActionRowRole', actionRowRole);