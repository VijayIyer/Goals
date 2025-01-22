const express = require("express");
const router = express.Router();
const controller = require("./tasksController.js");

router.get("/", controller.get);

router.post("/", (req, res) => {
    console.log(`req is ${req.body}`)
    return controller.post(req, res)
});

module.exports = router;