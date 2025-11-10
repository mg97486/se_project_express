const validator = require("validator");
const User = require("../models/user");

const getUsers = (req, res, next) =>
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => next(err));

const createUser = (req, res, next) => {
  const { name, avatar } = req.body;
  if (!name || typeof name !== "string" || name.trim().length < 2) {
    const err = new Error("Invalid user data");
    err.name = "ValidationError";
    return next(err);
  }
  if (avatar && !validator.isURL(avatar)) {
    const err = new Error("Invalid user data");
    err.name = "ValidationError";
    return next(err);
  }

  return User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => next(err));
};

const getUser = (req, res, next) => {
  const { id } = req.params;
  return User.findById(id)
    .then((user) => {
      if (!user) {
        const notFound = new Error("User not found");
        notFound.name = "NotFoundError";
        notFound.statusCode = 404;
        return next(notFound);
      }
      return res.status(200).send(user);
    })
    .catch((err) => next(err));
};

module.exports = { getUsers, createUser, getUser };
