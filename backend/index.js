const express = require("express");
const { Sequelize } = require('sequelize');
require('dotenv').config();

const app = express();
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: 'db.sqlite'
});

const PORT = process.env.PORT || 3000;
const tasksRouter = require("./tasksRouter");
app.use(express.json());
app.use("/tasks", tasksRouter);
app.listen(PORT, () => {
    console.log(`listening on port - ${PORT}`);
});
