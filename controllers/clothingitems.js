const validator = require("validator");
const ClothingItem = require("../models/clothingitems");
const {
  BadRequestError,
  NotFoundError,
  InternalServerError,
  ForbiddenError,
} = require("../utils/errors");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user?._id;

  if (
    !name ||
    typeof name !== "string" ||
    name.trim().length < 2 ||
    name.trim().length > 30
  ) {
    return next(new BadRequestError("Invalid data for creating item"));
  }

  const allowed = ["hot", "warm", "cold"];
  if (
    !weather ||
    typeof weather !== "string" ||
    !allowed.includes(String(weather).toLowerCase())
  ) {
    return next(new BadRequestError("Invalid data for creating item"));
  }

  if (
    !imageUrl ||
    typeof imageUrl !== "string" ||
    !validator.isURL(imageUrl, { require_protocol: true })
  ) {
    return next(new BadRequestError("Invalid data for creating item"));
  }

  return ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data for creating item"));
      }
      return next(new InternalServerError());
    });
};

const getItems = (req, res, next) =>
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => next(err || new InternalServerError()));

const deleteItem = (req, res, next) => {
  const { id } = req.params;
  const ownerId = req.user && req.user._id;

  return ClothingItem.findById(id)
    .orFail(() => new NotFoundError("Item not found"))
    .then((item) => {
      if (String(item.owner) !== String(ownerId)) {
        return next(new ForbiddenError("You can't delete other users' items"));
      }
      return ClothingItem.findByIdAndDelete(id).then(() =>
        res.status(200).send({ message: "Item deleted" })
      );
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID format"));
      }
      return next(err);
    });
};

const likeItem = (req, res, next) => {
  const { id } = req.params;
  const userId = req.user && req.user._id;

  return ClothingItem.findByIdAndUpdate(
    id,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .orFail(() => new NotFoundError("Item not found"))
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID format"));
      }
      return next(err);
    });
};

const unlikeItem = (req, res, next) => {
  const { id } = req.params;
  const userId = req.user && req.user._id;

  return ClothingItem.findByIdAndUpdate(
    id,
    { $pull: { likes: userId } },
    { new: true }
  )
    .orFail(() => new NotFoundError("Item not found"))
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID format"));
      }
      return next(err);
    });
};

const getItem = (req, res, next) => {
  const { id } = req.params;

  return ClothingItem.findById(id)
    .then((item) => {
      if (!item) {
        return next(new NotFoundError("Item not found"));
      }
      return res.status(200).send(item);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID format"));
      }
      return next(err);
    });
};

module.exports = {
  createItem,
  getItems,

  deleteItem,
  likeItem,
  unlikeItem,
  getItem,
};
