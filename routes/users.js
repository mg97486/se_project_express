const router = require("express").Router();
const auth = require("../middlewares/auth");
const { getCurrentUser } = require("../controllers/users");

router.use(auth);

router.get("/me", getCurrentUser);

module.exports = router;
