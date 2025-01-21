const express = require("express");
const {Sequelize, Model, DataTypes} = require("sequelize");
require('dotenv').config();
var bodyParser = require("body-parser");

const app = express();
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'db.sqlite'
});

// Sync models with database
sequelize.sync();

const PORT = process.env.PORT || 3000;
const tasksRouter = require("./tasksRouter");

// Middleware for parsing request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/tasks", tasksRouter);

app.listen(PORT, () => {
    console.log(`listening on port - ${PORT}`);
});