const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { scanFoodLabel } = require('../controllers/scannerController');
const { protect } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png/;
    cb(null, allowed.test(path.extname(file.originalname).toLowerCase()));
  },
});

router.post('/scan', protect, upload.single('image'), scanFoodLabel);

module.exports = router;
