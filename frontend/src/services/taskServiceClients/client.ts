import { CompletedTasksInfo, NewTask, Task } from '../../taskTypes';

export interface TaskServiceClient {
    createTask: (newTask: NewTask) => Promise<Task>;
    getAllTasks: () => Promise<Array<Task>>;
    getTaskById: (id: number) => Promise<Task>;
    deleteTaskById: (id: number) => Promise<object>;
    editTask: (task: Task) => Promise<Task>;
    getCompletedTasks: () => Promise<CompletedTasksInfo>;
};
