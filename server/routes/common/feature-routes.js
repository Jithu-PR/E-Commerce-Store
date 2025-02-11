const express = require('express');
const {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImage,
} = require('../../controllers/common/feature-controller');
const router = express.Router();

router.post('/add', addFeatureImage);
router.get('/get', getFeatureImages);
router.delete('/delete/:featureImageId', deleteFeatureImage);

module.exports = router;
