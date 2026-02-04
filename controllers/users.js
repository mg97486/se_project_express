const jwt = require("jsonwebtoken");
const User = require("../models/user");
const InternalServerError = require("../utils/errors/InternalServerError");
const BadRequestError = require("../utils/errors/BadRequestError");

const { JWT_SECRET = "dev-secret" } = process.env;
const NotFoundError = require("../utils/errors/NotFoundError");

const createUser = async (req, res, next) => {
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

    return res.status(201).json({
      message: "User created",
      userId: user._id,
    });
  } catch (error) {
    // Duplicate key error (email already exists)
    if (error && error.code === 11000) {
      return res.status(409).json({ message: "Email already exists." });
    }

    // Forward other errors to centralized error handler
    return next(new InternalServerError(error.message || "Server error"));
  }
};

const login = async (req, res, next) => {
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

const updateUser = (req, res, next) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return next(new NotFoundError("User not found"));
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err && err.name === "ValidationError") {
        const BadRequestError = require("../utils/errors/BadRequestError");
        return next(new BadRequestError(err.message));
      }
      return next(err);
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateUser,
};
