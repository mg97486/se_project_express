require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const mainRouter = require("./routes/index");
const { errorHandler } = require("./utils/errors");
const { login, createUser } = require("./controllers/users");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();
const { PORT = 3001 } = process.env;

app.use(requestLogger);

app.use(cors());
app.use(express.json());

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.post("/signin", login);
app.post("/signup", createUser);

app.use("/", mainRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Requested resource not found" });
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log("DB Connection Error:", err));

if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
}

module.exports = app;
