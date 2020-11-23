const { Tweet, User } = require('../models/models');
const faker = require('faker');

module.exports = async () => {
  for (let i = 0; i < 20; i++) {
    const user = new User({
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      description: faker.lorem.words(20),
      image: faker.internet.avatar(),
      password: 'root',
    });

    for (let j = 0; j < 3; j++) {
      const tweet = new Tweet({
        author: user,
        content: faker.lorem.sentence(12),
        date: faker.date.recent(),
        likes: [],
      });
      await tweet.save();
      user.tweets.push(tweet);
    }
    await user.save();
  }
};
