type Task = {
    id: number;
    title: string;
    description: string;
    deferred: boolean;
    deadline: Date;
    completed: boolean;
};
type NewTask = {
    title: string;
    description: string;
    deferred: boolean;
    deadline: Date;
    completed: boolean;
};
export type { Task, NewTask };
