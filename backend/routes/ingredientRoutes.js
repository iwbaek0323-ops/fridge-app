const express = require("express");
const router = express.Router();

const ingredientController = require("../controllers/ingredientController");
const verifyToken = require("../middleware/auth");

// ==================== 카테고리 조회 ====================
router.get("/categories", ingredientController.getCategories);

// ==================== 카테고리별 재료 조회 ====================
router.get("/master", ingredientController.getIngredientsByCategory);

// ==================== 재료 등록 ====================
router.post("/", verifyToken, ingredientController.addIngredient);

router.get("/", verifyToken, ingredientController.getUserIngredients);

router.put("/:id", verifyToken, ingredientController.updateIngredient);

// ==================== 재료 삭제 ====================
router.delete("/:id", verifyToken, ingredientController.deleteIngredient);

module.exports = router;