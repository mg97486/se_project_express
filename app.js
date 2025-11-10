const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const { errorHandler } = require("./utils/errors");

const app = express();
const { PORT = 3001 } = process.env;

app.use(express.json());

app.use((req, res, next) => {
  req.user = { _id: "690fcb2a7e84d558e85aca8d" };
  next();
});

app.use("/", mainRouter);

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

app.use((req, res) => {
  res.status(404).send({ message: "Requested resource not found" });
});

app.use(errorHandler);

module.exports = app;
