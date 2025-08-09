import dayjs from 'dayjs';
import {
    DateRange,
    FilterCriteria as TaskFilterCriteria,
    NewTask,
    Task,
    TasksByDay,
    CompletionInfo,
    Completed,
    Percentage,
    RankStat,
} from '../../types';
import { TaskServiceClient } from './client';
import { createTasks, filterTasksByDateRange, getGroupRange, groupTasksByGroupByValue } from '../../utils/tasks';
import { getDefaultDateRange } from '../../utils/date';
import { FilterBy, GroupBy, RankStatType, StatType } from '../../enums';
import { GroupedTasksType } from '../../interfaces';

class MockClient implements TaskServiceClient {
    mockTasks: Array<Task> = [];
    constructor() {
        this.mockTasks = createTasks(parseInt(process.env.REACT_APP_NUMBER_OF_INITIAL_TASKS || '100'));
    }
    createTask(newTask: NewTask): Promise<Task> {
        return new Promise<Task>((res, rej) => {
            const now = new Date();
            setTimeout(() => {
                const { title, description, deadline } = newTask;
                if (!title || !description || !deadline) rej('Error creating new task!');
                if (dayjs(deadline).isBefore(now, 'day')) {
                    rej('Deadline cannot be in the past!');
                }
                // adding id, completed and deferred are only required in mock server because it also is the store or acts like the db
                const createdTask = {
                    id: this.mockTasks.length,
                    completed: false,
                    deferred: false,
                    ...newTask,
                };
                this.mockTasks.push(createdTask);
                res(createdTask);
            }, 10);
        });
    }
    getTasks(filterCriteria: TaskFilterCriteria): Promise<Array<Task>> {
        const { dateRange, completed, shouldBeActive, deferred } = filterCriteria;
        return new Promise<Array<Task>>(res => {
            setTimeout(() => {
                res(
                    this.mockTasks
                        .filter(task => {
                            if (!dateRange) return true;
                            return filterTasksByDateRange([task], dateRange).length;
                        })
                        .filter(task => (completed ? task.completed === completed : true))
                        .filter(task => (shouldBeActive ? task.deferred !== shouldBeActive : true))
                        .filter(task => (deferred ? task.deferred === deferred : true))
                        .slice(),
                );
            }, 10);
        });
    }
    getTaskById(id: number): Promise<Task> {
        return new Promise<Task>((res, rej) => {
            setTimeout(() => {
                const task = this.mockTasks.find(task => task.id === id) as Task;
                if (!task) rej('No task with id found');
                res(task);
            }, 10);
        });
    }
    deleteTaskById(deletedTaskId: number) {
        return new Promise<object>((res, rej) => {
            setTimeout(() => {
                const taskToBeEditedIndex = this.mockTasks.findIndex(task => task.id === deletedTaskId);
                this.mockTasks.splice(taskToBeEditedIndex, 1);
                if (taskToBeEditedIndex === null) return rej(`No task with id ${deletedTaskId} exists`);
                res({ message: `Deleted task with id ${deletedTaskId}` });
            }, 10);
        });
    }
    editTask(editedTask: Task) {
        return new Promise<Task>((res, rej) => {
            setTimeout(() => {
                const taskToBeEditedIndex = this.mockTasks.findIndex(task => task.id === editedTask.id);
                this.mockTasks[taskToBeEditedIndex] = editedTask;
                if (taskToBeEditedIndex === null) return rej(`No task with id ${editedTask.id} exists`);
                res(editedTask);
            }, 10);
        });
    }

    async getCompletionInfo(dateRange: DateRange, showAllTasks: boolean): Promise<Array<TasksByDay>> {
        return new Promise<Array<TasksByDay>>(res => {
            const filteredTasks = showAllTasks
                ? this.mockTasks
                : filterTasksByDateRange(this.mockTasks, dateRange ?? getDefaultDateRange(FilterBy.DAY));
            const taskCompletionByDate: Array<TasksByDay> = filteredTasks.reduce((acc: Array<TasksByDay>, obj) => {
                if (!acc.find(a => obj.deadline.toDateString() === a.date))
                    acc.push({
                        date: obj.deadline.toDateString(),
                        total: 1,
                        totalCompleted: obj.completed ? 1 : 0,
                    });
                else {
                    const objectToUpdate = acc.find(a => obj.deadline.toDateString() === a.date);
                    if (!objectToUpdate)
                        acc.push({
                            date: obj.deadline.toDateString(),
                            total: 0,
                            totalCompleted: 0,
                        });
                    else {
                        objectToUpdate.total += 1;
                        objectToUpdate.totalCompleted += obj.completed ? 1 : 0;
                    }
                }
                return acc;
            }, []);
            setTimeout(() => {
                res(taskCompletionByDate);
            }, 10);
        });
    }

    async getOverallTaskCompletionInfo(): Promise<CompletionInfo> {
        return new Promise<CompletionInfo>(res => {
            res({
                total: this.mockTasks.length,
                completed: this.mockTasks.filter(task => task.completed === true).length,
                deferred: this.mockTasks.filter(task => task.deferred === true).length,
            });
        });
    }

    async getTaskCompletionInfo(requestedStatType: StatType, dateRange?: DateRange): Promise<Completed | Percentage> {
        const filteredTasks = dateRange ? filterTasksByDateRange(this.mockTasks, dateRange) : this.mockTasks;
        const overAllCompleted = filteredTasks.filter(task => task.completed === true).length;
        const overall = filteredTasks.length;
        return {
            completed: overAllCompleted,
            total: overall,
            ...(requestedStatType === StatType.PERCENTAGE && { percentage: (overAllCompleted / overall) * 100 }),
        };
    }
    async getRankStat(
        requestedStatType: StatType,
        rankStatType: RankStatType,
        rankStatGroupPeriod: GroupBy,
        dateRange?: DateRange,
    ): Promise<RankStat> {
        const filteredTasks = dateRange ? filterTasksByDateRange(this.mockTasks, dateRange) : this.mockTasks;
        const groupedTasks: GroupedTasksType = groupTasksByGroupByValue(filteredTasks, rankStatGroupPeriod);
        const groupedSummaryInCurrentDateRange = Object.keys(groupedTasks).map(key => {
            return {
                name: getGroupRange(key, rankStatGroupPeriod),
                total: groupedTasks[key].length,
                completed: groupedTasks[key].filter(task => task.completed === true).length,
            };
        });
        const bestPerformingItem = groupedSummaryInCurrentDateRange.reduce(
            (prev, current) => {
                return !prev.name
                    ? current
                    : prev.completed / prev.total > current.completed / current.total
                      ? prev
                      : current;
            },
            { name: '', completed: 0, total: 1 },
        );
        const worstPerformingItem = groupedSummaryInCurrentDateRange.reduce(
            (prev, current) => {
                return !prev.name
                    ? current
                    : prev.completed / prev.total < current.completed / current.total
                      ? prev
                      : current;
            },
            { name: '', completed: 0, total: 1 },
        );
        console.log(
            `bestperformingitem name - ${bestPerformingItem.name}, worstperforming item name - ${worstPerformingItem.name}`,
        );
        const name = rankStatType === RankStatType.BEST ? bestPerformingItem.name : worstPerformingItem.name;
        const completed =
            rankStatType === RankStatType.BEST ? bestPerformingItem.completed : worstPerformingItem.completed;
        const total = rankStatType === RankStatType.BEST ? bestPerformingItem.total : worstPerformingItem.total;
        return {
            name,
            value: {
                completed,
                total,
                ...(requestedStatType === StatType.PERCENTAGE && { percentage: (completed / total) * 100 }),
            },
        };
    }
}

export default new MockClient();
