import { mockTasks } from "../mockTasks";
import { Task, NewTask } from "../taskTypes";

export function listTasks() {
    return Promise.resolve(mockTasks.slice()); // need a better solution OR reading up on it. This .slice() makes sure we get an updated reference of mockTasks array
}
export function addTask(newTask: NewTask) {
    return new Promise((res, rej) => {
        setTimeout(() => {
            const {title, description, deadline, deferred} = newTask;
            if(!title || !description || !deadline) rej('Error creating new task!');
            mockTasks.push({
                id: mockTasks.length,
                ...newTask
            });
            res(newTask);
        });
    });
}

export function editTask(modifiedTask: Task) {
    return new Promise((res, rej) => {
        setTimeout(() => {
            console.log(mockTasks);
            const taskToBeEditedIndex = mockTasks.findIndex(task => task.id === modifiedTask.id);
            if(taskToBeEditedIndex === null) return rej(`No task with id ${modifiedTask.id} exists`);
            res(modifiedTask);
        });
    });
}

export function deleteTask(deleteTaskId: number) {
    return new Promise((res, rej) => {
        setTimeout(() => {
        const taskToBeEditedIndex = mockTasks.findIndex(task => task.id === deleteTaskId);
        mockTasks.splice(taskToBeEditedIndex, 1);
        if(taskToBeEditedIndex === null) return rej(`No task with id ${deleteTaskId} exists`);
        res(`Deleted task with id ${deleteTaskId}`);
        }, 1000);
    });
}