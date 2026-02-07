import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Actor } from '../../actors/entities/actor.entity';

@Entity('errors')
export class Error {
  @ApiProperty({ description: 'Unique identifier', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Error data', example: 'Something went wrong' })
  @Column({ type: 'text' })
  data: string;

  @ApiProperty({ description: 'AI advice for fixing the error', nullable: true })
  @Column({ type: 'text', nullable: true })
  advice: string;

  @ApiProperty({ description: 'Error occurrence counter', example: 0, default: 0 })
  @Column({ type: 'int', unsigned: true, default: 0 })
  counter: number;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({ description: 'Associated actors', type: () => [Actor] })
  @ManyToMany(() => Actor, (actor) => actor.errors)
  @JoinTable({
    name: 'errors_actors',
    joinColumn: { name: 'error_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'actor_id', referencedColumnName: 'id' },
  })
  actors: Actor[];
}
