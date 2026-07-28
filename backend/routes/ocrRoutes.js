const express = require("express");
const router = express.Router();
const multer = require("multer");
const ocrController = require("../controllers/ocrController");

// uploads 폴더에 저장
const upload = multer({
    dest: "uploads/"
});

router.post(
    "/",
    upload.single("receipt"),
    ocrController.extractText
);

module.exports = router;