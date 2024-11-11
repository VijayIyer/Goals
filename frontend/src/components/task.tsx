import React from 'react';
import { TaskType } from "../types/task";
import './task.css';

interface TaskProps {
    task: TaskType
}
function Task({task}: TaskProps){
    return (
        <div className='task'>
            {task.name}
            <button className='button marginLeftAuto'>Delete</button>
            <button className='button'>Edit</button>
            <button className='button'>Mark As Complete</button>
            <button className='button'>View History</button>
        </div>
    )
}

export default Task;