import { Tag } from 'src/tags/tag.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  uid?: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 100 })
  password: string;

  @Column({ type: 'varchar', length: 30, unique: true })
  nickname: string;

  @OneToMany((type) => Tag, (tag) => tag.user)
  tags?: Tag[];
}
