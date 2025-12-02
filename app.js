const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");
const { errorHandler, NotFoundError } = require("./utils/errors");
const { login, createUser } = require("./controllers/users");
const auth = require("./middlewares/auth");
const { getCurrentUser } = require("./controllers/users");
const { NOT_FOUND } = require("./utils/constants");

const app = express();
const { PORT = 3001 } = process.env;

app.use(cors());
app.use(express.json());

// GLOBAL HTML ERROR INTERCEPTOR
app.use((req, res, next) => {
  const origSend = res.send.bind(res);
  res.send = function (body) {
    try {
      if (res.statusCode >= 400 && typeof body === "string") {
        if (body.trim().startsWith("<")) {
          return res.json({ message: "An error occurred on the server" });
        }
      }
    } catch (e) {}
    return origSend(body);
  };
  next();
});

app.post("/signup", createUser);
app.post("/signin", login);

app.use(auth);

app.use("/", mainRouter);

app.use((req, res) => {
  res.status(NOT_FOUND).json({ message: "Requested resource not found" });
});

app.use(errorHandler);

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
}

module.exports = app;
