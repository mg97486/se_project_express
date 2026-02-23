const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingitems");
const {
  validateUserItem,
  validateUserId,
} = require("../middlewares/validation");

router.get("/", getItems);

router.use(auth);

router.post("/", validateUserItem, createItem);

router.delete("/:id", validateUserId, deleteItem);
router.delete("/:id/likes", validateUserId, unlikeItem);

router.put("/:id/likes", validateUserId, likeItem);

module.exports = router;
