const router = require("express").Router();
const {
  createItem,
  getItems,
  getItem,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingitems");

router.get("/", getItems);
router.get("/:id", getItem);

router.post("/", createItem);

router.delete("/:id", deleteItem);
router.delete("/:id/likes", unlikeItem);

router.put("/:id/likes", likeItem);

module.exports = router;
