const express = require("express");
const multer = require("multer");

const EventControler = require("../Controllers/EventController");

const AuthMiddleware = require("../Middlewares/authMiddleware");

const routes = express.Router();

const upload = require("../config/upload");

routes.post("/", AuthMiddleware, EventControler.store);
/*routes.post("/authenticate", TickerController.authenticate);
routes.get("/", AuthMiddleware, TickerController.show);
routes.put("/", AuthMiddleware, TickerController.update);
routes.post("/forgot_password", TickerController.forgotPass);
routes.post("/reset_pass", TickerController.resetPass);*/

module.exports = routes;
