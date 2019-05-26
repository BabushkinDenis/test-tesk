
const express = require('express');

const router = express.Router();
const pageController = require('../controller/pages');

/* GET home page. */
router.get('/', (req, res) => {
  pageController.main(req, res);
});

router.get('/:hash', (req, res, next) => {
  if (['api'].includes(req.params.hash)) next();
  pageController.answer(req, res, next);
});

module.exports = router;
