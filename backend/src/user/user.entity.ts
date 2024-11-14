import { 
    AfterInsert, 
    AfterRemove,
    AfterUpdate,
    Entity, 
    Column, 
    ObjectIdColumn,  
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm";
import { Task } from "src/tasks/tasks.entity";

@Entity('user')
export class User {
    @ObjectIdColumn()
    _id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @OneToMany(() => Task, (task) => task.user)
    tasks: Task[];

    @CreateDateColumn()
    created_at: Date; // Creation date

    @UpdateDateColumn()
    updated_at: Date; // Last updated date

    @AfterInsert()
    logInsert() {
      console.log('Inserted User with id', this._id);
    }
  
    @AfterUpdate()
    logUpdate() {
      console.log('Updated User with id', this._id);
    }
  
    @AfterRemove()
    logRemove() {
      console.log('Removed User with id', this._id);
    }
}