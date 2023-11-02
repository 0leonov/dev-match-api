import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { RefreshToken } from '../../auth/entities/refresh-token.entity';
import { Gender, Interest, Role } from '../enums';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, type: 'citext' })
  email: string;

  @Column({ unique: true, type: 'citext' })
  username: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  avatar_url: string;

  @Column({ default: '' })
  biography: string;

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.UNKNOWN,
  })
  gender: Gender;

  @Column({
    type: 'enum',
    enum: Role,
    array: true,
    default: [Role.USER],
  })
  roles: Role[];

  @Column({
    type: 'enum',
    enum: Interest,
    array: true,
    default: [],
  })
  interests: Interest[];

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.userId)
  refreshTokens: RefreshToken[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
