const BadRequestError = require("./BadRequestError");
const NotFoundError = require("./NotFoundError");
const InternalServerError = require("./InternalServerError");
const ForbiddenError = require("./ForbiddenError");
const ConflictError = require("./ConflictError");

module.exports = {
  BadRequestError,
  NotFoundError,
  InternalServerError,
  ForbiddenError,
  ConflictError,
};
