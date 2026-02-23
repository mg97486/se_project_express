const router = require("express").Router();
const auth = require("../middlewares/auth");
const userRouter = require("./users");
const clothingRouter = require("./clothingitems");
const NotFoundError = require("../utils/errors/NotFoundError");

router.use("/users", auth, userRouter);
router.use("/items", auth, clothingRouter);
router.use("/signin", userRouter.post("/signin"));
router.use("/signup", userRouter.post("/signup"));
router.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

router.use((req, res) => {
  res.status(404).json({ message: "Requested resource not found" });
});

module.exports = router;
