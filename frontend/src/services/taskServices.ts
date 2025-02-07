import { mockTasks } from "../mockTasks";
import { Task, NewTask } from "../taskTypes";

export function listTasks() {
    return new Promise<Array<Task>>((res, rej) => {
        setTimeout(() => {
            res(mockTasks.slice())
        }, 1000);
    }); // need a better solution OR reading up on it. This .slice() makes sure we get an updated reference of mockTasks array
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
        }, 1000);
    });
}

export function editTask(editedTask: Task) {
    return new Promise((res, rej) => {
        setTimeout(() => {
            const taskToBeEditedIndex = mockTasks.findIndex(task => task.id === editedTask.id);
            mockTasks[taskToBeEditedIndex] = editedTask;
            if(taskToBeEditedIndex === null) return rej(`No task with id ${editedTask.id} exists`);
            res(editedTask);
        }, 1000);
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

export function markTaskCompleted(taskId: number) {
    return new Promise<Task>((res, rej) => {
        setTimeout(() => {
            const taskToBeEditedIndex = mockTasks.findIndex(task => task.id === taskId);
            mockTasks[taskToBeEditedIndex].completed = !mockTasks[taskToBeEditedIndex].completed;
            res(mockTasks[taskToBeEditedIndex])
        }, 1000)
    })
}