import { User } from 'src/users/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.tags)
  user: User;

  @Column({ type: 'varchar', length: 40 })
  name: string;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;
}
