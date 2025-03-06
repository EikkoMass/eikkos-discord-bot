const { Schema, model } = require('mongoose');

const noteSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  guildId: {
    type: String,
    required: true
  },
  creationDate: {
    type: Date
  },
  img: {
    type: String
  },
  text: {
    type: String,
    required: true
  }
});

module.exports = model('Note', noteSchema)