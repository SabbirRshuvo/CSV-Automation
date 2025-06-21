const express = require("express");
const router = express.Router();
const csvController = require("../Controller/csvController");
const upload = require("../middleware/multer");

// Upload routes
router.get("/", csvController.uploadPage);
router.post(
  "/uploadOriginal",
  upload.single("originalFile"),
  csvController.uploadOriginal
);
router.post("/uploadOld", upload.single("oldFile"), csvController.uploadOld);
router.post("/deleteFile", csvController.deleteFile);
router.get("/selectFile", csvController.selectFile);
router.post("/selectFile", csvController.selectFile);

router.post("/removeDuplicate", csvController.removeDuplicate);

module.exports = router;
