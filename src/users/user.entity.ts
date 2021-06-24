import { RefreshSession } from 'src/auth/refresh-session.entity';
import { Tag } from 'src/tags/tag.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  uid: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 100 })
  password: string;

  @Column({ type: 'varchar', length: 30, unique: true })
  nickname: string;

  @OneToMany(() => Tag, (tag) => tag.creator)
  createdTags: Tag[];

  @OneToMany(() => RefreshSession, (refreshSession) => refreshSession.user)
  refreshSessions: RefreshSession[];

  @ManyToMany(() => Tag)
  @JoinTable()
  tags: Tag[];
}
