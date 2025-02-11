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
            allowNull: false,
            validate: { len: [0,32] }
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: { len: [0,300] }
        },
        deferred: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        deadline: {
            type: DataTypes.DATE,
            allowNull: true,
            validate: {
                isNotInThePast(value) {
                    const now = new Date();
                    if(now > value) {
                        throw new Error("Deadline cannot be in the past!!")
                    }
                }
            }
        },
        completed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    },
    {
    hooks: {
        beforeCreate: (task, options) => {
            if(!task.deadline) {
                const today = new Date();
                task.deadline = today.setDate(today.getDate() + 1);
            }
        }
    },
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