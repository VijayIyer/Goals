import { Body, Controller, Get, Post } from '@nestjs/common';
import { User } from './user.entity';

@Controller('user')
export class UserController {
    @Get()
    getUserById() {

    }

    @Post()
    async createUser(@Body() requestBody) {
        const {userName, password} = requestBody;
    }
}
