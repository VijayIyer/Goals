import { TaskPriority } from '../enums';
import { Task as TaskType } from '../types';
import { getRandomDateWithinRange } from './date';
export function createTasks(numberOfTasks: number): Array<TaskType> {
    return Array.from({ length: numberOfTasks }, (_, i) => i + 1).map(taskNumber => ({
        id: taskNumber,
        title: Math.random()
            .toString(10)
            .substring(2, Math.floor(Math.random() * 20)),
        description: Math.random()
            .toString(10)
            .substring(2, Math.floor(Math.random() * 50)),
        deferred: [true, false][Math.floor(Math.random() * 2)],
        completed: [true, false][Math.floor(Math.random() * 2)],
        deadline: getRandomDateWithinRange(new Date(2020, 1, 1), new Date(2027, 1, 1)),
        priority: [TaskPriority.HIGH, TaskPriority.MEDIUM, TaskPriority.LOW, undefined][Math.floor(Math.random() * 5)],
    }));
}
