const express = require('express');

const router = express.Router();

router.use('/users', require('./Users'));
// router.use('/products', require('./Products'));
router.use('/services', require('./Services'));
router.use('/billing', require('./Billing'));
router.use('/events', require('./Events'));
router.use('/ticket', require('./Ticket'));

module.exports = router;