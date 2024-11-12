import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from "typeorm";

@Entity('User')
export class User {
    @PrimaryColumn({type: Number})
    id:number;
    
    @Column({type: String})
    userName: string;

    @Column({type: String})
    password: string;

    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    updatedDate: Date;
}