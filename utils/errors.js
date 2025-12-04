const BadRequestError = require("./errors/BadRequestError");
const NotFoundError = require("./errors/NotFoundError");
const InternalServerError = require("./errors/InternalServerError");
const ForbiddenError = require("./errors/ForbiddenError");

const INTERNAL_SERVER_ERROR_CODE = 500;
const STATUS_CODE_BAD_REQUEST = 400;

/* eslint-disable-next-line no-unused-vars */
function errorHandler(err, req, res, _next) {
  if (err && err.statusCode) {
    const message =
      err.statusCode === 500 ? "An error occurred on the server" : err.message;
    return res.status(err.statusCode).json({ message });
  }

  if (err && err.name === "ValidationError") {
    return res
      .status(STATUS_CODE_BAD_REQUEST)
      .json({ message: err.message || "Invalid data" });
  }

  if (err && err.name === "CastError") {
    return res
      .status(STATUS_CODE_BAD_REQUEST)
      .json({ message: "Invalid id format" });
  }

  return res
    .status(INTERNAL_SERVER_ERROR_CODE)
    .json({ message: "An error occurred on the server" });
}

module.exports = {
  BadRequestError,
  NotFoundError,
  InternalServerError,
  ForbiddenError,
  errorHandler,
};
