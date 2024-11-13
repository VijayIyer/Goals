import { Controller } from '@nestjs/common';
import { Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthService } from './auth.service';

interface CreateUserRequest {
  username: string;
  password: string;
  passwordConfirmation: string
}

interface SignInRequest {
  username: string;
  password: string;
}

@Controller('user')
export class UserController {
    constructor(
        private usersService: UserService,
        private authService: AuthService,
      ) {}

    @Post('/signup')
    async createUser(@Body() body: CreateUserRequest) {
      const user = await this.authService.signup(body.username, body.password);
      return user;
    }
  
    @Post('/signin')
    async signin(@Body() body: SignInRequest) {
      const user = await this.authService.signin(body.username, body.password);
      return user;
    }
}
