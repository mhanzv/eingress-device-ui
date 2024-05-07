import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { _dbaccesslog } from '../../access-log/models/access-log.entity'; // Import the AccessLog entity

@Entity()
export class _dbemployee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  fullname: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column()
  role: string;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  regdate: Date;  // Registration date (date only)

  // @Column()
  // regdate:string;

  @Column()
  lastlogdate: string;

  @Column({nullable: true })
  profileImage: string;

  @Column({ nullable: true })
  rfidtag: string;

  @Column({ nullable: true })
  fingerprint: string;

  // @Column({ nullable: true })
  // profileImagePath?: string;

  @OneToMany(() => _dbaccesslog, accessLog => accessLog.employee)
  accessLogs: _dbaccesslog[]; // One-to-many relationship with AccessLog

  
}
