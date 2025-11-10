class BadRequestError extends Error {
  constructor(message = "Bad Request") {
    super(message);
    this.name = "BadRequestError";
    this.statusCode = 400;
  }
}

class NotFoundError extends Error {
  constructor(message = "Not Found") {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

class InternalServerError extends Error {
  constructor(message = "Internal Server Error") {
    super(message);
    this.name = "InternalServerError";
    this.statusCode = 500;
  }
}

class ForbiddenError extends Error {
  constructor(message = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
    this.statusCode = 403;
  }
}

function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.statusCode) {
    const message =
      err.statusCode === 500 ? "An error occurred on the server" : err.message;
    return res.status(err.statusCode).send({ message });
  }

  if (err.name === "ValidationError") {
    return res.status(400).send({ message: err.message || "Invalid data" });
  }

  if (err.name === "CastError") {
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
