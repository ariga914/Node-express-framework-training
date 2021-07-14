import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity('users')
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

	@Column()
    name: string;

    @Column()
    password: string;

    @Column()
    profession: string;

}
