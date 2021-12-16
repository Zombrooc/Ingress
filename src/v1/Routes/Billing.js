const express = require("express");

const BillingController = require('../Controllers/BillingController');
const authMiddleware = require("../Middlewares/authMiddleware");

const routes = express.Router();

routes.post("/", authMiddleware, BillingController.createBilling);

module.exports = routes;
