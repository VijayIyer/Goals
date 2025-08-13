import { GroupBy, RankStatType, StatType } from '../../enums';
import { Completed, CompletionInfo, DateRange, FilterCriteria, NewTask, Percentage, RankStat, Task } from '../../types';
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
    async getTasks(filterCriteria: FilterCriteria): Promise<Array<Task>> {
        const { dateRange, completed, deferred, shouldBeActive } = filterCriteria;
        return fetch(
            `${this.baseUrl}/tasks?${new URLSearchParams({
                ...(dateRange && { startDate: dateRange?.startDate.toDateString() }),
                ...(dateRange && dateRange.endDate && { endDate: dateRange?.endDate?.toDateString() }),
                // TODO: check why this is working and not {completed} without the toString()
                ...(completed && { completed: completed === true ? '1' : '0' }),
                ...(deferred && { deferred: shouldBeActive ? '0' : deferred === true ? '1' : '0' }),
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
    async getOverallTaskCompletionInfo(): Promise<CompletionInfo> {
        return new Promise<CompletionInfo>(res => {
            res({
                total: 0,
                completed: 0,
                deferred: 0,
            });
        });
    }
    async getTaskCompletionInfo(requestedStatType: StatType, dateRange?: DateRange): Promise<Completed | Percentage> {
        //TODO: implement
        console.log(`fetching ${requestedStatType} in ${JSON.stringify(dateRange)}`);
        return {
            completed: 5,
            total: 5,
        };
    }
    async getRankStat(
        requestedStatType: StatType,
        rankStatType: RankStatType,
        rankStatGroupPeriod: GroupBy,
        dateRange?: DateRange,
    ): Promise<RankStat> {
        //TODO: implement
        console.log(
            `fetching ${rankStatType} ${rankStatGroupPeriod} ${requestedStatType} in ${JSON.stringify(dateRange)}`,
        );
        return {
            name: 'Best',
            value: {
                completed: 5,
                total: 1,
            },
        };
    }
}

const baseUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:9000';
export default new HttpClient(baseUrl);
