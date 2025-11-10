const { getUsers, createUser, getUser } = require("../controllers/users");
const router = require("express").Router();

router.get("/", getUsers);
router.get("/:id", getUser);
router.post("/", createUser);

module.exports = router;
