import { CompletionInfo, FilterCriteria as TaskFilterCriteria, NewTask, Task } from '../../types';

export interface TaskServiceClient {
    createTask: (newTask: NewTask) => Promise<Task>;
    getTasks: (filterCriteria: TaskFilterCriteria) => Promise<Array<Task>>;
    getTaskById: (taskId: number) => Promise<Task>;
    deleteTaskById: (id: number) => Promise<object>;
    editTask: (task: Task) => Promise<Task>;
    getOverallTaskCompletionInfo: () => Promise<CompletionInfo>;
}
