import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Anthropic from '@anthropic-ai/sdk';
import { CreateErrorDto } from './dto/create-error.dto';
import { UpdateErrorDto } from './dto/update-error.dto';
import { Error } from './entities/error.entity';

@Injectable()
export class ErrorsService {
  private anthropic: Anthropic;

  constructor(
    @InjectRepository(Error)
    private readonly errorsRepository: Repository<Error>,
    private readonly configService: ConfigService,
  ) {
    this.anthropic = new Anthropic({
      apiKey: this.configService.get<string>('ANTHROPIC_API_KEY'),
    });
  }

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

  async advice(errorInfo: string): Promise<string> {
    const message = await this.anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `Проаналізуй наступну помилку та надай детальну інформацію:
1. В чому полягає помилка
2. Чому вона скоріш за все виникла
3. Як її можливо виправити

Помилка:
${errorInfo}`,
        },
      ],
    });

    const textBlock = message.content.find((block) => block.type === 'text');
    return textBlock ? textBlock.text : 'Не вдалося отримати аналіз помилки';
  }
}
