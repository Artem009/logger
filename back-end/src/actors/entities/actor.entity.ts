import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
} from 'typeorm';
import { Errors } from '../../errors/entities/error.entity';

@Entity('actors')
export class Actor {
  @ApiProperty({ description: 'Unique identifier', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Actor type', example: 'user' })
  @Column({ type: 'varchar' })
  type: string;

  @ApiProperty({ description: 'Actor name', example: 'John Doe' })
  @Column({ type: 'varchar' })
  name: string;

  @ManyToMany(() => Errors, (error) => error.actors)
  errors: Errors[];
}
