import { 
    Entity,
    ObjectIdColumn, 
    Column, 
    CreateDateColumn,
    UpdateDateColumn ,
    ManyToOne
} from "typeorm";
import { User } from "src/user/user.entity";

@Entity('task')
export class Task {
    @ObjectIdColumn()
    _id: number;

    @Column()
    title:string

    @Column()
    description: string;

    @Column({ type: 'date'})
    deadlineDate: string;

    @ManyToOne(() => User, user => user.tasks)
    user: User

    @CreateDateColumn()
    created_at: Date; // Creation date

    @UpdateDateColumn()
    updated_at: Date; // Last updated date
    
}