import { NewTask, Task } from "../../taskTypes"

export type TaskServiceClientType =  {
	createTask: (newTask: Task) => Promise<Task>,
	listTasks: () => Array<Promise<Task>>,
	getTaskById: (id: number) => Promise<Task>,
	deleteTaskById: (id: number) => {},
	editTaskById: (id: number) => Promise<Task>
}

export class TaskServiceClient {
	constructor() {

	}
	createTask(newTask: NewTask): Promise<Task> {
		throw Error('createTask method not implemented')
	}
	listTasks(): Promise<Array<Task>> {
		throw Error('listTasks method not implemented')
	}
	getTaskById(id: number): Promise<Task> {
		throw Error('getTaskById method not implemented')
	}
	deleteTaskById(id: number) {
		throw Error('deleteTaskById method not implemented')
	}
	editTask(task: Task): Promise<Task> {
		throw Error('editTaskById method not implemented')
	}
}