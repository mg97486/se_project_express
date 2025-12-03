const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingitems");

router.get("/", getItems);

router.use(auth);

router.post("/", createItem);

router.delete("/:id", deleteItem);
router.delete("/:id/likes", unlikeItem);

router.put("/:id/likes", likeItem);

module.exports = router;
