const TaskModel = require("./taskModel.js");
const controller = {
    get: async (req, res) => {
        const tasks = await TaskModel.findAll();
        console.log(`all tasks - ${tasks}`);
        return res.status(200).json(tasks);
    },
    getById: async (req, res) => {
        const {id} = req.params;
        const task = await TaskModel.findOne({ where: {id}});
        return res.status(200).json(task);
    },
    delete: async (req, res) => {
        try{ 
            const {id} = req.params;
            const task = await TaskModel.destroy({ where: {id}});
            return res.status(200).json(task);
        }
        catch(err) {
            console.error(err);
            return res.status(500).json(err);
        }
    },    
    update: async (req, res) => {
        const {id} = req.params;
        const {title, description} = req.body;
        try {
            const updatedTask = await TaskModel.update({
                title,
                description
            }, {where: {id}});
            return res.status(200).json(updatedTask);
        } catch(err) {
            console.error(err);
            return res.status(500).json(err);
        }
    },
    create: async (req, res) => {
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