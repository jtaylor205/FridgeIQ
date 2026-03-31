const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { scanFoodLabel, lookupUPC } = require('../controllers/scannerController');
const { protect } = require('../middleware/auth');

fs.mkdirSync('uploads', { recursive: true });

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
router.post('/upc', protect, lookupUPC);

module.exports = router;
