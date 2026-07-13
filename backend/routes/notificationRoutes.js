const express = require("express");

const router = express.Router();

const notificationController = require("../controllers/notificationController");

const authMiddleware = require("../middleware/auth");

// ==================== 알림 조회 ====================
router.get(
    "/",
    authMiddleware,
    notificationController.getNotifications
);

module.exports = router;

