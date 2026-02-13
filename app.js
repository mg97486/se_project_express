const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const mainRouter = require("./routes/index");
const { errorHandler } = require("./utils/errors");
const { login, createUser } = require("./controllers/users");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const auth = require("./middlewares/auth");
const { NOT_FOUND } = require("./utils/errors/NotFoundError");

const app = express();
const routes = express.Router();
const { PORT = 3001 } = process.env;

app.use(cors());
app.use(express.json());

// GLOBAL HTML ERROR INTERCEPTOR
app.use((req, res, next) => {
  const origSend = res.send.bind(res);
  res.send = function sendOverride(body) {
    try {
      if (res.statusCode >= 400 && typeof body === "string") {
        if (body.trim().startsWith("<")) {
          return res.json({ message: "An error occurred on the server" });
        }
      }
    } catch (e) {
      // swallow any unexpected error while overriding send
    }
    return origSend(body);
  };
  next();
});

app.post("/signup", createUser);
app.post("/signin", login);

app.use("/", mainRouter);

app.use((req, res) => {
  res.status(NOT_FOUND).json({ message: "Requested resource not found" });
});

app.use(errors());

app.use(errorHandler);

app.use(requestLogger);
app.use(routes);

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

if (require.main === module) {
  /* eslint-disable-next-line no-console */
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
}

module.exports = app;
