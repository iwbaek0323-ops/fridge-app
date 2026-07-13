const express = require("express");

const router = express.Router();

const recipeController = require("../controllers/recipeController");

const verifyToken = require("../middleware/auth");

// ==================== AI 레시피 추천 ====================
router.get(
    "/recommend",
    verifyToken,
    recipeController.getRecommendedRecipes
);

module.exports = router;