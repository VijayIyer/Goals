import { useState } from "react";
import { IconButton, Paper, Typography } from "@mui/material"

import { Task } from "../taskTypes";

import { Edit } from "@mui/icons-material";
import DeleteIcon from '@mui/icons-material/Delete';

import EditTaskModal from "./editTaskModal";
import DeleteTaskModal from "./deleteTaskModal";

export default ({task, onTaskEdited, onTaskDeleted}: {task: Task, onTaskEdited: () => Promise<void>, onTaskDeleted: () => Promise<void>}) => {
    console.log(`rendering task in edit task  - ${JSON.stringify(task)}`)
    const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
    const [isDeleteTaskModalOpen, setIsDeleteTaskModalOpen] = useState(false);

    const handleEditTaskModalButtonClick = () => {
        setIsEditTaskModalOpen(true);
    }
    const handleDeleteTaskModalButtonClick = () => {
        setIsDeleteTaskModalOpen(true);
    }

    const handleEditTaskModalSubmit = () => {
        onTaskEdited();
        setIsEditTaskModalOpen(false); 
    }

    const handleDeleteTaskModalSubmit = () => {
        onTaskDeleted();
        setIsDeleteTaskModalOpen(false);
    }

    return (
        <>
            <div key={task.id} style={{marginBottom: "2em", textAlign: "center", padding: "0.2em", border: "1px solid"}}>
                <Typography>{task.title}</Typography>
                <Typography>{task.description}</Typography>
                <Typography>{String(task.deferred)}</Typography>
                <Typography>{`${task.deadline.getDate()}, ${task.deadline.getMonth()}, ${task.deadline.getFullYear()}`}</Typography>
                <IconButton size="large" color="primary" onClick={handleEditTaskModalButtonClick}>
                    <Edit />
                </IconButton>
                <IconButton size="large" color="primary" onClick={handleDeleteTaskModalButtonClick}>
                    <DeleteIcon />
                </IconButton>
            </div>
            <EditTaskModal
                task={task}
                isOpen={isEditTaskModalOpen}
                onClose={() => setIsEditTaskModalOpen(false)}
                onSubmit={handleEditTaskModalSubmit}
            />
            <DeleteTaskModal
                id={task.id}
                isOpen={isDeleteTaskModalOpen}
                onClose={() => setIsDeleteTaskModalOpen(false)}
                onSubmit={handleDeleteTaskModalSubmit}
            />
        </>
    )
}