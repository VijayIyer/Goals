import dayjs from 'dayjs';
import { CompletedTasksInfo, NewTask, Task } from '../../taskTypes';
import { TaskServiceClient } from './client';

class MockClient implements TaskServiceClient {
    mockTasks: Array<Task> = [];
    createTask(newTask: NewTask): Promise<Task> {
        console.log(`creating new task in mock client`);
        return new Promise<Task>((res, rej) => {
            const now = new Date();
            setTimeout(() => {
                const { title, description, deadline } = newTask;
                console.log(
                    `${dayjs(now).isValid()} - ${dayjs(now).isSame(now, 'day')}`,
                );
                if (!title || !description || !deadline)
                    rej('Error creating new task!');
                if (dayjs(deadline).isBefore(now, 'day')) {
                    rej('Deadline cannot be in the past!');
                }
                this.mockTasks.push({
                    id: this.mockTasks.length,
                    ...newTask,
                });
                res({
                    id: this.mockTasks.length,
                    ...newTask,
                });
            }, 10);
        });
    }
    async getAllTasks(viewingDate: Date | null): Promise<Array<Task>> {
        console.log(viewingDate);
        return new Promise<Array<Task>>(res => {
            setTimeout(() => {
                res(
                    this.mockTasks
                        .filter(task =>
                            viewingDate
                                ? dayjs(task.deadline).isSame(
                                      viewingDate,
                                      'day',
                                  )
                                : true,
                        )
                        .slice(),
                );
            }, 10);
        });
    } // need a better solution OR reading up on it. This .slice() makes sure we get an updated reference of mockTasks array

    async getCompletedTasks(
        viewingDate: Date | null,
    ): Promise<CompletedTasksInfo> {
        return new Promise<CompletedTasksInfo>(res => {
            setTimeout(() => {
                const tasks = this.mockTasks
                    .filter(task =>
                        viewingDate
                            ? dayjs(task.deadline).isSame(viewingDate, 'day')
                            : true,
                    )
                    .slice();
                const completedTasks = tasks
                    .filter(task =>
                        viewingDate
                            ? dayjs(task.deadline).isSame(viewingDate, 'day')
                            : true,
                    )
                    .filter(task => task.completed);
                res({
                    completed: completedTasks.length,
                    total: tasks.length,
                });
            }, 10);
        });
    }
    getTaskById(id: number): Promise<Task> {
        return new Promise<Task>((res, rej) => {
            setTimeout(() => {
                const task = this.mockTasks.find(
                    task => task.id === id,
                ) as Task;
                if (!task) rej('No task with id found');
                res(task);
            }, 10);
        });
    }
    deleteTaskById(deletedTaskId: number) {
        return new Promise<object>((res, rej) => {
            setTimeout(() => {
                const taskToBeEditedIndex = this.mockTasks.findIndex(
                    task => task.id === deletedTaskId,
                );
                this.mockTasks.splice(taskToBeEditedIndex, 1);
                if (taskToBeEditedIndex === null)
                    return rej(`No task with id ${deletedTaskId} exists`);
                res({ message: `Deleted task with id ${deletedTaskId}` });
            }, 10);
        });
    }
    editTask(editedTask: Task) {
        return new Promise<Task>((res, rej) => {
            setTimeout(() => {
                const taskToBeEditedIndex = this.mockTasks.findIndex(
                    task => task.id === editedTask.id,
                );
                this.mockTasks[taskToBeEditedIndex] = editedTask;
                if (taskToBeEditedIndex === null)
                    return rej(`No task with id ${editedTask.id} exists`);
                res(editedTask);
            }, 10);
        });
    }
}

export default new MockClient();
