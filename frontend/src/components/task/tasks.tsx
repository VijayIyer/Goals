import React, {useEffect, useState} from 'react';
import Task from './task';
import { TaskType } from '../../types/task';
import './task.css';

export default function Tasks({
    userId
}: {userId: string}) {
    const [tasks, setTasks] = useState<Array<TaskType>>([]);

    useEffect(() => {
        
    }, []);
    return (
        <div className='container'>
            <button className='button'>Add</button>
            {tasks.map(task => <Task task={task} />)}
        </div>
    )
}