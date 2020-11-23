require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Tweet, User } = require("../models/models");

module.exports = {
  /* USERS TO FOLLOW */
  usersToFollow: async (req, res) => {
    const loggedUser = await User.findById(req.user);
    let users = await User.find({ _id: { $nin: req.user } });
    users = users.filter((user) => !loggedUser.following.includes(user.id));
    res.json(users);
  },

  // FOR PROFILE PAGE
  findByUsername: async (req, res) => {
    const { username } = req.params;
    const user = await User.findOne({ username }).populate("tweets");
    const tweets = await Tweet.find({ author: user.id }).populate("author");
    return res.json({
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      tweets,
      description: user.tweets,
      image: user.image,
      following: user.following,
      followers: user.followers,
    });
  },

  // FOR HOME PAGE
  showHomeTweets: async (req, res) => {
    User.findById(req.user).then((loggedUser) => {
      Tweet.find({ author: loggedUser })
        .populate("author")
        .then((tweetsUser) => {
          Tweet.find({ author: { $in: loggedUser.following } })
            .populate("author")
            .limit(20)
            .then((tweets) => {
              tweets = [...tweetsUser, ...tweets];
              res.json(tweets.sort((a, b) => b.date - a.date));
            });
        });
    });
  },

  /* CREATE USER */
  create: async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    User.findOne({ email: req.body.email }).then((user) => {
      if (user) {
        return res.status(409).json({ error: "El usuario ya existe" });
      }
      const newUser = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        email: req.body.email,
        image: "/img/profile-img.png",
        password: hashedPassword,
      });
      newUser.save();
      res.json({ ok: "Usuario registrado con éxito" });
    });
  },

  /* LOGIN USER */
  login: (req, res) => {
    User.findOne({ email: req.body.email })
      .then(async function (user) {
        if (!user) {
          return res.status(401).json({ error: "El usuario no existe" });
        }
        const resultado = await bcrypt.compare(
          req.body.password,
          user.password
        );
        if (!resultado) {
          return res.status(401).json({ error: "Credenciales incorrectas" });
        }
        const accessToken = jwt.sign(user.id, process.env.ACCESS_TOKEN_SECRET);
        res.json({
          accessToken,
          email: user.email,
          username: user.username,
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          image: user.image,
          following: user.following,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  },

  /* EDIT USER */
  edit: (req, res) => {
    User.findById(req.user)
      .then((user) => {
        user.firstname = req.body.firstname;
        user.lastname = req.body.lastname;
        user.username = req.body.username;
        user.image = req.body.image;
        user.save();
        res.status(200).json({ message: "usuario editado" });
      })
      .catch();
  },

  follow: async (req, res) => {
    const loggedUser = await User.findById(req.user);
    const { id } = req.params;

    if (!loggedUser.following.includes(id)) {
      loggedUser.following.push(id);
      await loggedUser.save();

      const userFollowed = await User.findById(id);
      userFollowed.followers.push(req.user);
      await userFollowed.save();
      res.json({ ok: "Usuario seguido" });
    }
  },

  unfollow: async (req, res) => {
    const loggedUser = await User.findById(req.user);
    const { id } = req.params;
    const userUnfollowed = await User.findById(id);
    console.log(id);

    if (loggedUser.following.includes(id)) {
      loggedUser.following = loggedUser.following.filter(
        (user) => user.toString() !== id.toString()
      );
      await loggedUser.save();

      userUnfollowed.followers = userUnfollowed.followers.filter(
        (user) => user.toString() !== loggedUser._id.toString()
      );
      await userUnfollowed.save();
      res.json({ ok: "Se dejó de seguir" });
    }
  },
};
