const BadRequestError = require("./errors/BadRequestError");
const NotFoundError = require("./errors/NotFoundError");
const InternalServerError = require("./errors/InternalServerError");
const ForbiddenError = require("./errors/ForbiddenError");

function errorHandler(err, req, res, next) {
  void next;

  if (err && err.statusCode) {
    const message =
      err.statusCode === 500 ? "An error occurred on the server" : err.message;
    return res.status(err.statusCode).send({ message });
  }

  if (err && err.name === "ValidationError") {
    return res.status(400).send({ message: err.message || "Invalid data" });
  }

  if (err && err.name === "CastError") {
    return res.status(400).send({ message: "Invalid id format" });
  }

  return res.status(500).send({ message: "An error occurred on the server" });
}

module.exports = {
  BadRequestError,
  NotFoundError,
  InternalServerError,
  ForbiddenError,
  errorHandler,
};
