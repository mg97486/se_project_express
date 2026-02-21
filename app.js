require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const mainRouter = require("./routes/index");
const { errorHandler } = require("./utils/errors");
const { login, createUser } = require("./controllers/users");
const { requestLogger, errorLogger } = require("./middlewares/logger");
// const auth = require("./middlewares/auth"); // Keep this here to use in mainRouter or here

const app = express();
const { PORT = 3001 } = process.env;

// 1. Request Logger goes FIRST
app.use(requestLogger);

app.use(cors());
app.use(express.json());

// 2. Public Routes (No Auth required)
app.post("/signin", login);
app.post("/signup", createUser);

// 3. The Main Router
// Ensure that inside routes/index.js, you are using the auth middleware
// for protected routes like /users/me
app.use("/", mainRouter);

// 4. 404 Handler (Must be after all valid routes)
app.use((req, res) => {
  res.status(404).json({ message: "Requested resource not found" });
});

// 5. Error Logger (Must be after routes, before handlers)
app.use(errorLogger);

// 6. Celebrate error handler
app.use(errors());

// 7. Centralized Error Handler (Must be LAST)
app.use(errorHandler);

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log("DB Connection Error:", err));

if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
}

module.exports = app;
