import React, {useEffect, useState} from 'react';
import Task from './task';
import { TaskType } from '../types/task';
import './task.css';

export default function Tasks() {
    const [tasks, setTasks] = useState<Array<TaskType>>([]);

    useEffect(() => {
        setTasks([
            {
                id: 1,
                name: 'task1',
                description: 'description of task 1',
                deadline: Date.now()
            },
            {
                id: 2,
                name: 'task2',
                description: 'description of task 2',
                deadline: Date.now()
            },
            {
                id: 3,
                name: 'task3',
                description: 'description of task 3',
                deadline: Date.now()
            },
            {
                id: 4,
                name: 'task4',
                description: 'description of task 4',
                deadline: Date.now()
            },
            {
                id: 1,
                name: 'task1',
                description: 'description of task 1',
                deadline: Date.now()
            }
        ])
    }, []);
    return (
        <div className='container'>
            <button className='button'>Add</button>
            {tasks.map(task => <Task task={task} />)}
        </div>
    )
}