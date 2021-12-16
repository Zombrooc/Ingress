const express = require("express");

const ServiceController = require("../Controllers/ServiceController");
const authMiddleware = require("../Middlewares/authMiddleware");

const routes = express.Router();

routes.post("/", authMiddleware, ServiceController.store);
routes.get("/", ServiceController.index);
routes.get("/:serviceId", ServiceController.show);
routes.put("/:serviceId", authMiddleware, ServiceController.update);
routes.delete("/:serviceId", authMiddleware, ServiceController.delete);

module.exports = routes;
