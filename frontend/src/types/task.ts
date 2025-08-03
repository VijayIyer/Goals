import { TaskPriority } from '../enums';
import { DateRange } from './date';
export type Task = {
    id: number;
    title: string;
    description: string;
    deferred: boolean;
    deadline: Date;
    completed: boolean;
    priority?: TaskPriority;
    tags?: Array<string>;
};
export type NewTask = {
    title: string;
    description: string;
    deadline: Date;
    priority?: TaskPriority;
    tags?: Array<string>;
};

export type CompletionInfo = {
    completed: number;
    deferred: number;
    total: number;
};

export type TasksByDay = {
    date: string;
    total: number;
    totalCompleted: number;
};

export type FilterCriteria = {
    dateRange?: DateRange;
    completed?: boolean;
    deferred?: boolean;
    shouldBeActive?: boolean;
    priority?: TaskPriority;
};
