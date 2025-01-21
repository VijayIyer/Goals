const {Model} = require("sequelize");
const model = new Model({
    title,
    description,
    createdAt,
    deadline
});

module.exports = model;