import { DateRange, NewTask, Task, TasksByDay } from '../../types';

export interface TaskServiceClient {
    createTask: (newTask: NewTask) => Promise<Task>;
    getTasks: (viewingDate: Date | null, completed?: boolean) => Promise<Array<Task>>;
    getTaskById: (id: number) => Promise<Task>;
    deleteTaskById: (id: number) => Promise<object>;
    editTask: (task: Task) => Promise<Task>;
    getDeferredTasks: () => Promise<Array<Task>>;
    getCompletionInfo: (dateRange: DateRange) => Promise<Array<TasksByDay>>;
}
