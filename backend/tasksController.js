const TaskModel = require("./taskModel.js");
const controller = {
    get: async (req, res) => {
        const tasks = await TaskModel.findAll();
        console.log(`all tasks - ${tasks}`);
        return res.status(200).json({});
    },
    post: async (req, res) => {
        console.log(req.body);
        const {title, description} = req.body;
        try {
            const task = await TaskModel.create({title: "title", description: "description"});
            return res.status(201).json(JSON.stringify(task));
        } catch(err) {
            console.error(err);
            return res.status(500).json(err);
        }
        
    }
};

module.exports = controller;