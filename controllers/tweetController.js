const { Tweet, User } = require('../models/models');

module.exports = {
  /* NEW TWEET */
  create: async (req, res) => {
    const { content } = req.body;

    const user = await User.findById(req.user);
    const newTweet = new Tweet({
      author: user.id,
      content,
      date: Date.now(),
      likes: [],
    });
    await newTweet.save();

    const { tweets } = user;
    tweets.push(`${newTweet.id}`);
    await user.save();
    res.json({ ok: 'Se creó un nuevo tweet' });
  },

  /* DELETE TWEET */
  destroy: (req, res) => {
    Tweet.findById(req.params.id).then(tweetToDelete => {
      // req.user lo tengo disponible por jwt
      if (tweetToDelete.author.toString() === req.user) {
        User.findById(req.user).then(user => {
          user.tweets = user.tweets.filter(
            tweet => tweet.toString() !== tweetToDelete.id
          );
          user.save();
        });
        tweetToDelete.remove();
        res.json({ ok: 'Se eliminó el tweet' });
      }
      res.status(401).json({ error: 'Usuario no autorizado' });
    });
  },

  /* LIKE TWEET */
  like: async (req, res) => {
    const tweet = await Tweet.findById(req.params.id);
    likes = tweet.likes;
    if (!likes.includes(req.user)) {
      tweet.likes.push(req.user);
      tweet.save();
      res.json({ ok: 'Me gusta' });
    } else {
      tweet.likes = tweet.likes.filter(id => id !== req.user);
      res.json({ ok: 'No me gusta' });
    }
    // console.log(tweet);
  },
};
