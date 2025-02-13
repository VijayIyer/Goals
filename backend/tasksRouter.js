const express = require("express");
const router = express.Router();
const controller = require("./tasksController.js");

router.get("/", controller.get);
router.get("/:id", controller.getById);
router.delete("/:id", controller.delete);
router.put("/:id", controller.update);
router.post("/", controller.create);

module.exports = router;