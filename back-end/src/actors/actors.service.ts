import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Actor } from './entities/actor.entity';
import { CreateActorDto } from './dto/create-actor.dto';
import { UpdateActorDto } from './dto/update-actor.dto';

@Injectable()
export class ActorsService {
  constructor(
    @InjectRepository(Actor)
    private readonly actorsRepository: Repository<Actor>,
  ) {}

  create(createActorDto: CreateActorDto) {
    const actor = this.actorsRepository.create(createActorDto);
    return this.actorsRepository.save(actor);
  }

  findAll() {
    return this.actorsRepository.find();
  }

  async findOne(id: number) {
    const actor = await this.actorsRepository.findOneBy({ id });
    if (!actor) {
      throw new NotFoundException(`Actor with id ${id} not found`);
    }
    return actor;
  }

  async findOrCreate(name: string, type: string): Promise<Actor> {
    const existing = await this.actorsRepository.findOneBy({ name, type });
    if (existing) {
      return existing;
    }
    const actor = this.actorsRepository.create({ name, type });
    return this.actorsRepository.save(actor);
  }

  async update(id: number, updateActorDto: UpdateActorDto) {
    const actor = await this.findOne(id);
    Object.assign(actor, updateActorDto);
    return this.actorsRepository.save(actor);
  }

  async remove(id: number) {
    const actor = await this.findOne(id);
    return this.actorsRepository.remove(actor);
  }
}
