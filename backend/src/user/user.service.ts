import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private repo: Repository<User>) {}

    create(username: string, password: string) {
        const user = this.repo.create({ username, password });
        return this.repo.save(user);
    }

    findOne(id: number) {
        if(!id) {
            return null;
        }
        return this.repo.findOneById(id);
    }

    find(username: string) {
        return this.repo.find({ where: { username } });
    }

    async update(id: number, attrs: Partial<User>) {
        const user = await this.findOne(id);
        if(!user) {
            throw new NotFoundException('user not found');
        }
        Object.assign(user, attrs);
        return this.repo.save(user);
    }
}
