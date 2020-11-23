const express = require("express");

const apiRouter = express.Router();
const checkJwt = require("express-jwt");
const apiController = require("../controllers/apiController");
const tweetController = require("../controllers/tweetController");

function checkToken() {
  return checkJwt({
    secret: process.env.ACCESS_TOKEN_SECRET,
    algorithms: ["HS256"],
  });
}

apiRouter.post("/login", apiController.login);
apiRouter.post("/users", apiController.create);
apiRouter.get("/users", checkToken(), apiController.usersToFollow);
apiRouter.put("/users/update", checkToken(), apiController.edit);
apiRouter.get("/users/followed", checkToken(), apiController.showHomeTweets);
apiRouter.put("/users/follow/:id", checkToken(), apiController.follow);
apiRouter.put("/users/unfollow/:id", checkToken(), apiController.unfollow);
apiRouter.get("/users/:username", apiController.findByUsername);
apiRouter.post("/tweets", checkToken(), tweetController.create);
apiRouter.delete("/tweets/:id", checkToken(), tweetController.destroy);
apiRouter.put("/tweets/:id", checkToken(), tweetController.like);

module.exports = apiRouter;
