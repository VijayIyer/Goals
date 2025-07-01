import { TaskPriority, GROUP_BY } from '../enums';
import { Task as TaskType, DateRange } from '../types';
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

export function filterTasks(tasks: Array<TaskType>, dateRange: DateRange): Array<TaskType> {
    if (dateRange.groupBy === GROUP_BY.DAY) {
        return tasks.filter(task => task.deadline.toDateString() === dateRange.startDate.toDateString());
    }
    if (dateRange.groupBy === GROUP_BY.WEEK || dateRange.groupBy === GROUP_BY.CUSTOM) {
        return tasks.filter(
            task =>
                task.deadline >= dateRange.startDate &&
                (dateRange.endDate ? task.deadline <= dateRange?.endDate : true),
        );
    }
    if (dateRange.groupBy === GROUP_BY.MONTH) {
        return tasks.filter(
            task =>
                task.deadline.getFullYear() === dateRange.year &&
                task.deadline.toLocaleString('default', { month: 'long' }) === dateRange.month,
        );
    }
    if (dateRange.groupBy === GROUP_BY.YEAR) {
        return tasks.filter(task => task.deadline.getFullYear() === dateRange.year);
    }
    return tasks;
}
