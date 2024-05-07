import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
export enum UserRole{
  ADMIN= 'admin',
  Employee='employee'
}
@Entity()
export class _dbadmin {
  @PrimaryGeneratedColumn()
  id: number;
 
  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({type:'enum', enum:UserRole,default:UserRole.ADMIN})
  role: UserRole;
}