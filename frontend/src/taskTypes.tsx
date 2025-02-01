type Task =  {
    id: number,
    title: string, 
    description: string,
    deferred: boolean,
    deadline: Date  
}
type NewTask = {
    title: string, 
    description: string,
    deferred: boolean,
    deadline: Date
}
export type {Task, NewTask};