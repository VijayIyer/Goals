import { Controller, Post, Body, NotFoundException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { AuthService } from 'src/user/auth.service';
import { UserService } from 'src/user/user.service';
import { NotFoundError } from 'rxjs';

interface CreateTaskRequest {
    userId: number;
    title: string;
    description: string;
    deadlineDate: string;
}
@Controller('tasks')
export class TasksController {
    constructor(private taskService: TasksService, private userService: UserService){}

    @Post()
    async create(@Body() request: CreateTaskRequest) {
        const {userId, ...task} = request;
        const user = await this.userService.findOne(userId);
        if(!user) {
            throw new NotFoundException('user not found')
        }
        const newTask = this.taskService.create(user, task);
        return newTask;
    }
}
