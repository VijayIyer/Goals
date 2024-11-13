import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Task } from './tasks.entity';
import { User } from '../user/user.entity';

interface CreateTask {
    title: string;
    description: string;
    deadlineDate: string;
}

@Injectable()
export class TasksService {
    constructor(private repo: Repository<Task>) {}

    create(user: User, task: CreateTask) {
        return this.repo.create({
            title: task.title,
            description: task.description,
            deadlineDate: task.deadlineDate,
            user
        }); 
    }
}
