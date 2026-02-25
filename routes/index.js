const router = require("express").Router();
const userRouter = require("./users");
const NotFoundError = require("../utils/errors/NotFoundError");
const { login, createUser } = require("../controllers/users");
const {
  validateLogin,
  validateCreateUser,
} = require("../middlewares/validation");
const clothingitems = require("./clothingitems");

router.post("/signin", validateLogin, login);
router.post("/signup", validateCreateUser, createUser);

router.use("/users", userRouter);
router.use("/items", clothingitems);

router.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

module.exports = router;
