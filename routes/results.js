const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

require('../models/Link');
const Link = mongoose.model('links');

router.get('/',  (req, res) => {
    res.send('results')
});
module.exports = router;