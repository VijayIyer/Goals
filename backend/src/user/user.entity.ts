import { Entity, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity('User')
export class User {
    @Column({type: String})
    userName: string;

    @Column({type: String})
    password: string;

    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    updatedDate: Date;
}