import { 
    ObjectIdColumn, 
    Column, 
    CreateDateColumn,
    UpdateDateColumn ,
    ManyToOne
} from "typeorm";
import { User } from "src/user/user.entity";

export class Task {
    @ObjectIdColumn()
    id: number;

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