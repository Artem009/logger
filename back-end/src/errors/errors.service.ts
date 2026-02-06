import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateErrorDto } from './dto/create-error.dto';
import { UpdateErrorDto } from './dto/update-error.dto';
import { Error } from './entities/error.entity';

@Injectable()
export class ErrorsService {
  constructor(
    @InjectRepository(Error)
    private readonly errorsRepository: Repository<Error>,
  ) {}

  create(createErrorDto: CreateErrorDto) {
    const error = this.errorsRepository.create(createErrorDto);
    return this.errorsRepository.save(error);
  }

  findAll() {
    return this.errorsRepository.find();
  }

  async findOne(id: string) {
    const error = await this.errorsRepository.findOneBy({ id });
    if (!error) {
      throw new NotFoundException(`Error with id ${id} not found`);
    }
    return error;
  }

  async update(id: string, updateErrorDto: UpdateErrorDto) {
    const error = await this.findOne(id);
    Object.assign(error, updateErrorDto);
    return this.errorsRepository.save(error);
  }

  async remove(id: string) {
    const error = await this.findOne(id);
    return this.errorsRepository.remove(error);
  }
}
