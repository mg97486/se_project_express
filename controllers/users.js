const validator = require("validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const InternalServerError = require("../utils/errors/InternalServerError");

const { JWT_SECRET = "dev-secret" } = process.env;

// GET ALL USERS
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

// CREATE USER (only email + password required)
const createUser = async (req, res) => {
  try {
    const { email, password, name, avatar } = req.body;

    if (!email || !password) {
      return next(new BadRequestError("Email and password required."));
    }

    const user = await User.create({
      email,
      password,
      name,
      avatar,
    });

    res.status(201).json({
      message: "User created",
      userId: user._id,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email already exists." });
    }
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findUserByCredentials(email, password);

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    return res.status(200).send({
      message: "Login successful",
      token,
      userId: user._id,
    });
  } catch (err) {
    return next(new InternalServerError("Invalid email or password"));
  }
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        const notFound = new Error("User not found");
        notFound.statusCode = 404;
        return next(notFound);
      }
      return res.status(200).send(user);
    })
    .catch(next);
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
};
