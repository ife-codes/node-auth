const express = require("express");
const mongoose = require("mongoose");

// imports
const authRouter = require("./routes/authRouthes");
const cookieParser = require("cookie-parser");
const { requestAuth, checkAuth } = require("./middleware/authMiddleware");

const app = express();

// middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set("view engine", "ejs");

// database connection
const dbURI =
  "mongodb+srv://ife:praisejoseph23@nodify.sieym.mongodb.net/node?retryWrites=true&w=majority&authSource=admin&ssl=true";

mongoose
  .connect(dbURI)
  .then((result) => {
    app.listen(3000);
    console.log("Server is running!");
  })
  .catch((err) => console.log(err));

// routes
app.get("*", checkAuth);
app.get("/", (req, res) => res.render("home"));
app.get("/smoothies", requestAuth, (req, res) => res.render("smoothies"));
app.use(authRouter);
