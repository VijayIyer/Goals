import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(private userService: UserService) {
        
    }

    async signup(email: string, password: string) {
        // see if email is in use
        const users = await this.userService.find(email);
        if(users.length) {
            throw new BadRequestException('email in use');
        }
        
        // Create a new user and save it
        const user = await this.userService.create(email, password);

        // return the user
        return user;
    }

    async signin(email: string, password: string) {
        const [user] = await this.userService.find(email);
        if(!user) {
            throw new NotFoundException('user not found');
        }
        if(user.password !== password) {
            throw new UnauthorizedException('invalid credentials');
        }
        return user;
    }
}
