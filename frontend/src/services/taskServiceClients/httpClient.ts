import { GroupBy, RankStatType, StatType } from '../../enums';
import { Completed, CompletionInfo, DateRange, FilterCriteria, NewTask, Percentage, RankStat, Task } from '../../types';
import { getEndDateFromDateRange, getStartDateFromDateRange } from '../../utils';
import { TaskServiceClient } from './client';

class HttpClient implements TaskServiceClient {
    baseUrl: string = '';
    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }
    async createTask(newTask: NewTask): Promise<Task> {
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
                        // TODO: why is this required?
                        deadline: new Date(task.deadline),
                    }),
                ),
            )
            .catch(err => {
                console.error(err);
                return err;
            });
    }

    async getTaskById(id: number): Promise<Task> {
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
    async deleteTaskById(deletedTaskId: number) {
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
    async editTask(editedTask: Task) {
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
        return fetch(`${this.baseUrl}/completionInfo`, {
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
            .catch(err => {
                console.error(err);
                return err;
            });
    }
    async getCompletionStat(requestedStatType: StatType, dateRange?: DateRange): Promise<Completed | Percentage> {
        //TODO: implement
        console.log(`fetching ${requestedStatType} in ${JSON.stringify(dateRange)}`);
        const startDate = getStartDateFromDateRange(dateRange || null); // FIXME: this should not be required once date range only consists of start and end date
        const endDate = getEndDateFromDateRange(dateRange || null); // FIXME: this should not be required once date range only consists of start and end date
        return fetch(
            `${this.baseUrl}/completionStat?${new URLSearchParams({
                stat: requestedStatType,
                ...(dateRange && { startDate: startDate.toDateString() }),
                ...(dateRange && dateRange.endDate && { endDate: endDate.toDateString() }),
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
            .catch(err => {
                console.error(err);
                return err;
            });
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
        //TODO: implement
        console.log(`fetching ${requestedStatType} in ${JSON.stringify(dateRange)}`);
        const startDate = getStartDateFromDateRange(dateRange || null); // FIXME: this should not be required once date range only consists of start and end date
        const endDate = getEndDateFromDateRange(dateRange || null); // FIXME: this should not be required once date range only consists of start and end date
        return fetch(
            `${this.baseUrl}/rankStat?${new URLSearchParams({
                stat: requestedStatType,
                rankStat: rankStatType,
                groupPeriod: rankStatGroupPeriod,
                ...(dateRange && { startDate: startDate.toDateString() }),
                ...(dateRange && dateRange.endDate && { endDate: endDate.toDateString() }),
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
            .catch(err => {
                console.error(err);
                return err;
            });
    }
}

const baseUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:9000';
export default new HttpClient(baseUrl);
