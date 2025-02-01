import { mockTasks } from "./mockTasks";
import { NewTask } from "./taskTypes";

export function listTasks() {
    return Promise.resolve(mockTasks);      
}
export function addTaskService(newTask: NewTask) {
    return new Promise((res, rej) => {
        setTimeout(() => {
        const {title, description, deadline, deferred} = newTask;
        if(!title || !description || !deadline) rej('Error creating new task!');
        mockTasks.push({
            id: mockTasks.length,
            ...newTask
        });
        res(newTask);
        }, 1000);
    });
}