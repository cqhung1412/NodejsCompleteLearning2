const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 5
    },
    imageUrl: {
      type: String
    },
    content: {
      type: String,
      required: true,
      minlength: 5
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
