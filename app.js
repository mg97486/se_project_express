const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const { errorHandler } = require("./utils/errors");

const app = express();
const { PORT = 3001 } = process.env;

app.use(express.json());

app.use((req, res, _next) => {
  const origSend = res.send.bind(res);
  res.send = function sendIntercept(body) {
    try {
      if (res.statusCode >= 400 && typeof body === "string") {
        const trimmed = body.trim();
        if (trimmed.startsWith("<")) {
          return res.json({ message: "An error occurred on the server" });
        }
      }
    } catch (e) {
      // ignore and fall back to original send
    }
    return origSend(body);
  };
  return _next();
});

app.use((req, res, _next) => {
  req.user = { _id: "690fcb2a7e84d558e85aca8d" };
  _next();
});

app.use("/", mainRouter);

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

if (require.main === module) {
  app.listen(PORT, () => {});
}

app.use((req, res) => {
  res.status(404).json({ message: "Requested resource not found" });
});

app.use(errorHandler);

module.exports = app;
