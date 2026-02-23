const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  getCurrentUser,
  updateUser,
  login,
  createUser,
} = require("../controllers/users");
const {
  validateUserId,
  validateLogin,
  validateNewUser,
  validateUpdateUser,
} = require("../middlewares/validation");

router.use(auth);

router.get("/me", validateUserId, getCurrentUser);
router.patch("/me", validateUpdateUser, updateUser);

router.post("/signin", validateLogin, login);
router.post("/signup", validateNewUser, createUser);
module.exports = router;
