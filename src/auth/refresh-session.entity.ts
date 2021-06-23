import { User } from 'src/users/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class RefreshSession {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => User, (user) => user.refreshSessions, {
    eager: true,
  })
  user: User;

  @Column({ type: 'uuid' })
  refreshToken: string;

  @Column({ type: 'bigint' })
  expiresIn: number;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'NOW()',
  })
  createdAt: Date;
}
