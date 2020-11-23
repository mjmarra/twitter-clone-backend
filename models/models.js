/* CONNECTION DB */
const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://root:root@ha-tweeter-clone.lcmro.mongodb.net/ha-tweeter-clone?retryWrites=true&w=majority"
);

mongoose.connection
  .once("open", () =>
    console.log("¡Conexión con la base de datos establecida !!!!")
  )
  .on("error", (error) => console.log(error));

/* USER MODEL */
const User = require("./User");

/* TWEET MODEL */
const Tweet = require("./Tweet");

module.exports = {
  User,
  Tweet,
};
