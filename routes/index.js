const router = require("express").Router();
const userRouter = require("./users");
const NotFoundError = require("../utils/errors/NotFoundError");
const { login, createUser } = require("../controllers/users");
const {
  validateLogin,
  validateCreateUser,
} = require("../middlewares/validation");

router.use("/signin", validateLogin, login);
router.use("/signup", validateCreateUser, createUser);
router.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

module.exports = router;
