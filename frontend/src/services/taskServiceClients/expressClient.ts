import { NewTask, Task } from "../../taskTypes";
import { TaskServiceClient } from "./client";

class ExpressClient extends TaskServiceClient {
	baseUrl: String = "";
	constructor(baseUrl: string) {
		super();
		this.baseUrl = baseUrl;
	}
	createTask(newTask: NewTask): Promise<Task> {
		return fetch(this.baseUrl + `/tasks`, {
				method: "POST",
				body: JSON.stringify(newTask),
				headers: {
					"Content-Type": "application/json"
				}
		})
			.then(res => res.json())
			.catch(console.error)
	}
	async listTasks(): Promise<Array<Task>> {
		return fetch(this.baseUrl + `/tasks`)
			.then(res => res.json())
			.catch(console.error)
 	} // need a better solution OR reading up on it. This .slice() makes sure we get an updated reference of mockTasks array
	getTaskById(id: number): Promise<Task> {
		return fetch(this.baseUrl + `/tasks/${id}`)
			.then(res => res.json())
			.catch(console.error)
	}
	deleteTaskById(deletedTaskId: number) {
		return fetch(this.baseUrl + `/tasks/${deletedTaskId}`, {
			method: "DELETE"
		})
			.then(res => res.json())
			.catch(console.error)
	}
	editTask(editedTask: Task) {
		return fetch(this.baseUrl + `/tasks/${editedTask.id}`, {
			method: "PUT",
			body: JSON.stringify(editedTask),
			headers: {
				"Content-Type": "application/json"
			}
		})
			.then(res => res.json())
			.catch(console.error)
	}
}

const baseUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:9000";
export default new ExpressClient(baseUrl);