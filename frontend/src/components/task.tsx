import { useEffect, useState } from "react";
import { IconButton, Paper, Typography } from "@mui/material"

import { Task } from "../taskTypes";

import { Edit } from "@mui/icons-material";
import DeleteIcon from '@mui/icons-material/Delete';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

import EditTaskModal from "./editTaskModal";
import DeleteTaskModal from "./deleteTaskModal";
import { markTaskCompleted } from "../services/taskServices";

export default ({task, onTaskEdited, onTaskDeleted}: {task: Task, onTaskEdited: () => Promise<void>, onTaskDeleted: () => Promise<void>}) => {
    const [isTaskCompleted, setIsTaskCompleted] = useState<boolean>(false)
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

    const handleEditTaskMarkedCompletedClick = async () => {
        await markTaskCompleted(task.id)
        onTaskEdited();
    }

    useEffect(() => {
        setIsTaskCompleted(task.completed);
    }, [task.completed])

    return (
        <>
            <div key={task.id} style={{marginBottom: "2em", textAlign: "center", padding: "0.2em", border: `5px solid ${isTaskCompleted ? "green" : "black"}`}}>
                <Typography>{task.title}</Typography>
                <Typography>{task.description}</Typography>
                <Typography>{String(task.deferred)}</Typography>
                <Typography>{`${task.deadline.getDate()}, ${task.deadline.getMonth()}, ${task.deadline.getFullYear()}`}</Typography>
                <IconButton size="large" color="primary" onClick={handleEditTaskModalButtonClick}>
                    <Edit />
                </IconButton>
                <IconButton size="large" color="primary" onClick={handleEditTaskMarkedCompletedClick}>
                    {!isTaskCompleted && <CheckBoxOutlineBlankIcon />}
                    {isTaskCompleted && <CheckBoxIcon />}
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