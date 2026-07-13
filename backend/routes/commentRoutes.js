const express = require("express");
const router = express.Router();

const commentController = require("../controllers/commentController");
const verifyToken = require("../middleware/auth");

// 댓글 작성
router.post("/", verifyToken, commentController.createComment);

// 댓글 조회
router.get("/:post_id", commentController.getComments);

// 댓글 수정
router.put("/:id", verifyToken, commentController.updateComment);

// 댓글 삭제
router.delete("/:id", verifyToken, commentController.deleteComment);

module.exports = router;