const router = require("express").Router();
const {
  createItem,
  getItems,
  getItem,
  updateItem,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingitems");

router.get("/", getItems);

router.get("/:id", getItem);

router.post("/", createItem);
router.delete("/:id", deleteItem);
router.put("/:id/like", likeItem);
router.put("/:id", updateItem);
router.delete("/:id/like", unlikeItem);

router.put("/:id/likes", likeItem);
router.delete("/:id/likes", unlikeItem);

module.exports = router;
