import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';

import { v4 as uuid } from 'uuid';

import { User } from '../../users/entities/User';

enum OperationType {
  TRANSFERS = 'transfers'
}

@Entity('transfers')
export class Transfers {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column('uuid')
  user_id: string;
  
  @ManyToOne(() => User, user => user.transfers)
  @JoinColumn({ name: 'user_id', })
  user_receive: User;
  
  @Column('uuid')
  send_id: string;

  @ManyToOne(() => User, user => user.transfers)
  @JoinColumn({ name: 'send_id', })
  user_send: User;

  @Column()
  description: string;

  @Column('decimal', { precision: 5, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: OperationType })
  type: OperationType;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}