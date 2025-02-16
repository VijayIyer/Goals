const TaskModel = require("./taskModel.js");
const controller = {
    get: async (req, res) => {
        try {
            const {completed} = req.query;
            console.log(`req.params - ${JSON.stringify(req.query)}`)
            if(completed) {
                const tasks = await TaskModel.findAll({
                    where: {completed: true}
                });
                return res.status(200).json(tasks);
            } else {
                return res.status(200).json(await TaskModel.findAll());
            }
        } catch(err) {
            return res.status(500).json(err)
        }
    },
    getById: async (req, res) => {
        const {id} = req.params;
        const task = await TaskModel.findOne({ where: {id}});
        return res.status(200).json(task);
    },
    getCompletedTasks: async (req, res) => {
        try {
            const tasks = await TaskModel.findAll();
            const completedTasks = tasks.filter(task => Boolean(task.completed));
            console.log(`tasks - ${tasks.length}, completedTasks = ${completedTasks.length}`);
            return res.status(200).json({
                completed: completedTasks.length,
                total: tasks.length
            })
        } catch (err) {
            return res.status(500).json(err);
        }
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
        const {title, description, deferred, deadline, completed} = req.body;
        try {
            await TaskModel.update({
                title,
                description,
                deferred,
                deadline,
                completed
            }, {
                where: {id},
                returning: true,
                plain: true
            })
            .then(async result => {
                const response = await TaskModel.findByPk(id)
                return res.status(200).json(response);
            })
        } catch(err) {
            console.error(err);
            return res.status(500).json(err);
        }
    },
    create: async (req, res) => {
        try {
            const task = await TaskModel.create({...req.body});
            return res.status(201).json(task);
        } catch(err) {
            console.error(err);
            return res.status(500).json(err);
        }
        
    }
};

module.exports = controller;