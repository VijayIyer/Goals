import { CompletedTasksInfo, NewTask, Task } from '../../taskTypes';
import { TaskServiceClient } from './client';

class ExpressClient implements TaskServiceClient {
    baseUrl: string = '';
    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }
    createTask(newTask: NewTask): Promise<Task> {
        return fetch(this.baseUrl + `/tasks`, {
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
    async getAllTasks(viewingDate: Date | null): Promise<Array<Task>> {
        return fetch(
            this.baseUrl +
                `/tasks` +
                `?` +
                new URLSearchParams({
                    viewingDate: viewingDate?.toISOString().split('T')[0] || '',
                }),
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
    } // need a better solution OR reading up on it. This .slice() makes sure we get an updated reference of mockTasks array
    async getCompletedTasks(
        viewingDate: Date | null,
    ): Promise<CompletedTasksInfo> {
        const querySearchParams = new URLSearchParams({
            viewingDate: viewingDate?.toISOString().split('T')[0] || '',
        });
        console.log(querySearchParams);
        return Promise.resolve({
            completed: 0,
            total: 0,
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
}

const baseUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:9000';
export default new ExpressClient(baseUrl);
