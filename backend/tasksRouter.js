const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    return res.status(200).json({
        tasks: [
            {
                id: 1
            }, 
            {
                id: 2
            }
        ]
    })
});

router.post("/", (req, res) => {
    res.status(200).send('added task!')
});

module.exports = router;