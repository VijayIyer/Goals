const express = require("express");
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;
const tasksRouter = require("./tasksRouter");

app.use("/tasks", tasksRouter);
app.get("/users", (req, res) => {
    res.send(`Getting all users!!`);
})

app.listen(PORT, () => {
    console.log(`listening on port - ${PORT}`);
});