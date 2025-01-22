const {Sequelize, DataTypes, Model} = require("sequelize");
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "db.sqlite"
});

class Task extends Model {}

Task.init(
    {
        title: {
            type: DataTypes.STRING,
            allowNull: true
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        }
    },
    {
     sequelize,
     freezeTableName: true,
    }
)


// Sync models with database
sequelize.sync()
.then(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})

module.exports = Task;