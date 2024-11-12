import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthService } from './auth.service';

@Controller('user')
export class UserController {
    constructor(
        private usersService: UserService,
        private authService: AuthService,
      ) {}
}
