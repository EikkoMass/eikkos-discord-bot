import { Schema, model } from 'mongoose';

const roleContext = new Schema({
  name: {
    type: String,
    required: true
  },
  guildId: {
    type: String,
    required: true
  },
});

export default model('RoleContext', roleContext);