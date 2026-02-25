const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  createClothingItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingitems");
const {
  validateClothingItem,
  validateClothingItemId,
} = require("../middlewares/validation");

router.get("/", getItems);

router.use(auth);

router.post("/", validateClothingItem, createClothingItem);

router.delete("/:id", validateClothingItemId, deleteItem);
router.delete("/:id/likes", validateClothingItemId, unlikeItem);

router.put("/:id/likes", validateClothingItemId, likeItem);

module.exports = router;
