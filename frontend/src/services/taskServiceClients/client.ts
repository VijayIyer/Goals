import { CompletedTasksInfo, NewTask, Task } from '../../taskTypes';

export interface TaskServiceClient {
    createTask: (newTask: NewTask) => Promise<Task>;
    getAllTasks: (viewingDate: Date | null) => Promise<Array<Task>>;
    getTaskById: (id: number) => Promise<Task>;
    deleteTaskById: (id: number) => Promise<object>;
    editTask: (task: Task) => Promise<Task>;
    getCompletedTasks: (
        viewingDate: Date | null,
    ) => Promise<CompletedTasksInfo>;
}
