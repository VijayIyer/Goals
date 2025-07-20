import { Task } from '../types';

export interface GroupedTasksType {
    [key: string]: Array<Task>;
}
