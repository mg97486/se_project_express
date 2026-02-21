const router = require("express").Router();
const auth = require("../middlewares/auth");
const userRouter = require("./users");
const clothingRouter = require("./clothingitems");

router.use("/users", auth, userRouter);
router.use("/items", auth, clothingRouter);

router.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

module.exports = router;
