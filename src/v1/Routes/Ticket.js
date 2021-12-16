const express = require("express");
const multer = require("multer");

const TicketController = require("../Controllers/TicketController");

const AuthMiddleware = require("../Middlewares/authMiddleware");

const routes = express.Router();

const upload = require("../config/upload");

routes.post("/", AuthMiddleware, TicketController.store);
/*routes.post("/authenticate", TickerController.authenticate);
routes.get("/", AuthMiddleware, TickerController.show);
routes.put("/", AuthMiddleware, TickerController.update);
routes.post("/forgot_password", TickerController.forgotPass);
routes.post("/reset_pass", TickerController.resetPass);*/

module.exports = routes;
