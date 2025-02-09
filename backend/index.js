const express = require("express");
const cors = require("cors");
const { Sequelize } = require('sequelize');
const tasksRouter = require("./tasksRouter");
require('dotenv').config();
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cors());

app.use("/tasks", tasksRouter);
app.listen(PORT, () => {
    console.log(`listening on port - ${PORT}`);
});
