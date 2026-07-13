const express = require("express");
const router = express.Router();

const postController = require("../controllers/postController");
const verifyToken = require("../middleware/auth");
const optionalAuth = require("../middleware/optionalAuth");

// ==================== 게시글 작성 ====================
router.post("/", verifyToken, postController.createPost);

// 게시글 목록 조회
router.get("/", postController.getPosts);

// 게시글 상세 조회
router.get("/:id", optionalAuth, postController.getPostById);

router.put("/:id", verifyToken, postController.updatePost);

router.delete("/:id", verifyToken, postController.deletePost);

// 좋아요
router.post("/:id/like", verifyToken, postController.toggleLike);

module.exports = router;