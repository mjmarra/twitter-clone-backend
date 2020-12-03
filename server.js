require("dotenv").config();

const APP_PORT = process.env.APP_PORT || 5000;
const express = require("express");

const path = require("path");

const app = express();
const cors = require("cors");
const seeds = require("./seeds/seeds");

// seeds();

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(cors()); // Use this after the variable declaration

require("./routes/routes")(app);

app.listen(APP_PORT, () => {
	console.log(`Listening on port ${APP_PORT}`);
	console.log(`Enter http://localhost:${APP_PORT}`);
});
