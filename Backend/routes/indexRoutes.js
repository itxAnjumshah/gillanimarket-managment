// Root routes (non-resource endpoints)

const express = require('express');
const router = express.Router();

const { getApiRoot } = require('../controllers/indexController');

router.get('/', getApiRoot);

module.exports = router;

