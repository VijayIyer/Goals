import { Task } from '../types';

export interface GroupedTasksType {
    [key: string]: Array<Task>;
}

export interface GroupedTasksSummary {
    name: string;
    completed: number;
    total: number;
}
