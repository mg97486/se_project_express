const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const InternalServerError = require("../utils/errors/InternalServerError");
const BadRequestError = require("../utils/errors/BadRequestError");
const NotFoundError = require("../utils/errors/NotFoundError");
const ConflictError = require("../utils/errors/ConflictError");

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
    const userObj = user.toObject();
    delete userObj.password;

    return res.status(201).send(userObj);
  } catch (err) {
    if (err.code === 11000) {
      return next(new ConflictError("Email already exists."));
    }
    return next(
      new InternalServerError("An error occurred while creating the user.")
    );
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
      user: {
        name: user.name,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      },
    });
  } catch (err) {
    if (err.message === "Invalid email or password") {
      return next(new BadRequestError("Invalid email or password"));
    }
    return next(new InternalServerError("An error occurred during login."));
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
        return next(new BadRequestError("Invalid data"));
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
