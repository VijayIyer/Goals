import { TaskPriority, FilterBy, GroupBy } from '../enums';
import { GroupedTasksType } from '../interfaces/task';
import { Task as TaskType, DateRange } from '../types';
import { getRandomDateWithinRange, getRangeForDate } from './date';
import { getDateWeek, getWeekEndDate, getWeekStartDate } from './week';

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

export function filterTasksByFilterBy(tasks: Array<TaskType>, filterBy: FilterBy) {
    switch (filterBy) {
        case FilterBy.DAY:
            return tasks.filter(task => task.deadline.toDateString() === new Date().toDateString()); // TODO: is this a robust way of comparing
        case FilterBy.WEEK:
            return tasks.filter(task => {
                const currentYear = new Date().getFullYear();
                const taskDate = new Date(task.deadline);
                taskDate.setHours(0, 0, 0, 0);
                const weekNumber = getDateWeek(new Date());
                const currentWeekStartDate = getWeekStartDate(weekNumber, currentYear);
                const currentWeekEndDate = getWeekEndDate(weekNumber, currentYear);
                currentWeekStartDate.setHours(0, 0, 0, 0);
                if (currentWeekEndDate) currentWeekEndDate.setHours(0, 0, 0, 0);
                return taskDate >= currentWeekStartDate && (currentWeekEndDate ? taskDate <= currentWeekEndDate : true);
            });
        case FilterBy.MONTH:
            return tasks.filter(
                task =>
                    task.deadline.toLocaleString('default', { month: 'long' }) ===
                    new Date().toLocaleDateString('default', { month: 'long' }),
            );
        default:
            return tasks;
    }
}

export function filterTasksByDateRange(tasks: Array<TaskType>, dateRange: DateRange): Array<TaskType> {
    if (dateRange.filterBy === FilterBy.DAY) {
        return tasks.filter(task => task.deadline.toDateString() === dateRange.startDate.toDateString()); // TODO: is this a robust way of comparing
    }
    if (dateRange.filterBy === FilterBy.WEEK || dateRange.filterBy === FilterBy.CUSTOM) {
        return tasks.filter(task => {
            const taskDate = new Date(task.deadline);
            taskDate.setHours(0, 0, 0, 0);
            dateRange.startDate.setHours(0, 0, 0, 0);
            if (dateRange.endDate) dateRange.endDate?.setHours(0, 0, 0, 0);
            return taskDate >= dateRange.startDate && (dateRange.endDate ? taskDate <= dateRange?.endDate : true);
        });
    }
    if (dateRange.filterBy === FilterBy.MONTH) {
        return tasks.filter(
            task =>
                task.deadline.getFullYear() === dateRange.year &&
                task.deadline.toLocaleString('default', { month: 'long' }) === dateRange.month,
        );
    }
    if (dateRange.filterBy === FilterBy.YEAR) {
        return tasks.filter(task => task.deadline.getFullYear() === dateRange.year);
    }
    return tasks;
}

export function groupTasks(tasks: Array<TaskType>, groupBy: GroupBy) {
    const groupedTasks: Array<GroupedTasksType> = [];
    tasks.forEach(task => {
        const groupIndex: number = groupedTasks.findIndex(
            group => group.range === getRangeForDate(task.deadline, groupBy),
        );
        if (groupIndex == -1) {
            groupedTasks.push({
                range: getRangeForDate(task.deadline, groupBy),
                tasks: [task],
            });
        } else {
            groupedTasks[groupIndex].tasks.push(task);
        }
    });
    return groupedTasks;
}
