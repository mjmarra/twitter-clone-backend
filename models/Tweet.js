const mongoose = require('mongoose');

const { Schema } = mongoose;

const tweetSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    content: String,
    date: { type: Date, default: Date.now },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

const Tweet = mongoose.model('Tweet', tweetSchema);

module.exports = Tweet;
