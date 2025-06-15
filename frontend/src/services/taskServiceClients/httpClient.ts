import { NewTask, Task, TasksByDay } from '../../types';
import { TaskServiceClient } from './client';

class HttpClient implements TaskServiceClient {
    baseUrl: string = '';
    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }
    createTask(newTask: NewTask): Promise<Task> {
        return fetch(`${this.baseUrl}/tasks`, {
            method: 'POST',
            body: JSON.stringify({
                ...newTask,
                deadline: newTask.deadline.toDateString(),
            }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw `HTTP error ${response.status}`;
                }
                return response.json();
            })
            .then(res => {
                return {
                    ...res,
                    deadline: new Date(res.deadline),
                };
            });
    }
    async getTasks(
        viewingDate: Date | null,
        completed: boolean = false,
    ): Promise<Array<Task>> {
        return fetch(
            `${this.baseUrl}/tasks?${new URLSearchParams({
                viewingDate: viewingDate?.toISOString().split('T')[0] || '',
                completed: completed.toString(),
            })}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            },
        )
            .then(response => {
                if (!response.ok) {
                    throw `HTTP error ${response.status}`;
                }
                return response.json();
            })
            .then((res: Array<Task>) =>
                res.map(
                    (task: Task): Task => ({
                        ...task,
                        deadline: new Date(task.deadline),
                    }),
                ),
            )
            .catch(err => {
                console.error(err);
                return err;
            });
    }

    getTaskById(id: number): Promise<Task> {
        return fetch(this.baseUrl + `/tasks/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw `HTTP error ${response.status}`;
                }
                return response.json();
            })
            .catch(console.error);
    }
    deleteTaskById(deletedTaskId: number) {
        return fetch(this.baseUrl + `/tasks/${deletedTaskId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw `HTTP error ${response.status}`;
                }
                return response.json();
            })
            .catch(console.error);
    }
    editTask(editedTask: Task) {
        return fetch(this.baseUrl + `/tasks/${editedTask.id}`, {
            method: 'PUT',
            body: JSON.stringify(editedTask),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw `HTTP error ${response.status}`;
                }
                return response.json();
            })
            .then(res => ({
                ...res,
                deadline: new Date(res.deadline),
            }));
    }
    getDeferredTasks(): Promise<Array<Task>> {
        return Promise.resolve([]);
    }
    getCompletionInfo(): Promise<Array<TasksByDay>> {
        return Promise.resolve([]);
    }
}

const baseUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:9000';
export default new HttpClient(baseUrl);
