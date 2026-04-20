const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { scanFoodLabel, lookupUPC } = require('../controllers/scannerController');
const { protect } = require('../middleware/auth');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png/;
    const ext = path.extname(file.originalname).toLowerCase();
    const isAllowedExt = allowed.test(ext);
    const isAllowedMime = allowed.test(file.mimetype);

    if (isAllowedExt && isAllowedMime) {
      return cb(null, true);
    }
    cb(new Error('Only JPEG and PNG images are allowed'));
  },
});

router.post('/scan', protect, upload.single('image'), scanFoodLabel);
router.post('/upc', protect, lookupUPC);

module.exports = router;
