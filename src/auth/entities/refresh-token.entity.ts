import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';

import { User } from '../../users/entities/user.entity';

@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryColumn({ type: 'uuid', unique: true })
  token: string;

  @ManyToOne(() => User, (user) => user.refreshTokens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  @Column({ type: 'uuid' })
  userId: string;

  @Column()
  expiresIn: Date;
}
