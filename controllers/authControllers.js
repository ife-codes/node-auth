const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const handleErrors = (error) => {
  let errors = { email: "", password: "" };

  if (error.message.includes("user validation failed")) {
    Object.values(error.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  if (error.message.includes("Incorrect email")) {
    errors.email = "that email does not exist";
  }

  if (error.message.includes("Incorrect password")) {
    errors.password = "that password is incorrect";
  }

  if (
    error.cause &&
    error.cause.code === 11000 &&
    error.cause.keyPattern.email
  ) {
    errors.email = "This email already exists";
  }

  return errors;
};

const login_get = (req, res) => {
  res.render("login");
};

const login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};

const signup_get = (req, res) => {
  res.render("signup");
};

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, "net ninja soup", {
    expiresIn: maxAge,
  });
};

const signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};

const logout = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/")
};

module.exports = {
  login_get,
  login_post,
  signup_get,
  signup_post,
  logout,
};
