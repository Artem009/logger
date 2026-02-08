import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Anthropic from '@anthropic-ai/sdk';
import { CreateErrorDto } from './dto/create-error.dto';
import { UpdateErrorDto } from './dto/update-error.dto';
import { Errors } from './entities/error.entity';
import { ActorsService } from '../actors/actors.service';

@Injectable()
export class ErrorsService {
  private anthropic: Anthropic;

  constructor(
    @InjectRepository(Errors)
    private readonly errorsRepository: Repository<Errors>,
    private readonly configService: ConfigService,
    private readonly actorsService: ActorsService,
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
    return this.errorsRepository.find({ relations: ['actors'] });
  }

  findLatest(limit: number = 10) {
    return this.errorsRepository.find({
      relations: ['actors'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async findOne(id: string) {
    const error = await this.errorsRepository.findOne({ where: { id }, relations: ['actors'] });
    if (!error) {
      throw new NotFoundException(`Error with id ${id} not found`);
    }
    return error;
  }

  async findOneByContent(data: string) {
    return await this.errorsRepository.findOneBy({ data });
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

  async handleWebhook(body: any) {
    const issueTitle = body.data?.issue?.title;
    const actorData = body.actor;

    const existingError = await this.findOneByContent(issueTitle);

    if (existingError) {
      // const isExistingErrorToday = existingError?.createdAt?.getDate() === new Date().getDate();
      // if (isExistingErrorToday) {
        existingError.counter += 1;
        await this.errorsRepository.save(existingError);
        return;
      // }
    }

    const actor = await this.actorsService.findOrCreate(
      actorData.name,
      actorData.type,
    );

    const adviceText = await this.advice(issueTitle);

    const error = this.errorsRepository.create({ data: body, advice: adviceText });
    error.actors = [actor];
    await this.errorsRepository.save(error);
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
