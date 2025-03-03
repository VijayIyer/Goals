const { Op } = require("sequelize");
const TaskModel = require("./taskModel.js");
const controller = {
    get: async (req, res) => {
        try {
            const {completed, viewingDate} = req.query;
            console.log(`req.query - ${JSON.stringify(req.query)}, ${completed === 'true'}}`)
            if(completed) return res.status(200).json(await TaskModel.findAll({
                where: {
                    [Op.and]: [
                        {completed: completed === 'true'},
                        {deadline:{[Op.startsWith]: viewingDate ? viewingDate : ''}}
                    ]
                }
            }));
            return res.status(200).json(await TaskModel.findAll({
                where: {deadline:{[Op.startsWith]: viewingDate ? viewingDate : ''}}
            }));
        } catch(err) {
            return res.status(500).json(err)
        }
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