import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ErrorsService } from './errors.service';
import { CreateErrorDto } from './dto/create-error.dto';
import { UpdateErrorDto } from './dto/update-error.dto';
import { AdviceErrorDto } from './dto/advice-error.dto';
import { Errors } from './entities/error.entity';

@ApiTags('errors')
@Controller('errors')
export class ErrorsController {
  constructor(private readonly errorsService: ErrorsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new error' })
  @ApiResponse({
    status: 201,
    description: 'Error created successfully',
    type: Errors,
  })
  create(@Body() createErrorDto: CreateErrorDto) {
    return this.errorsService.create(createErrorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all errors' })
  @ApiResponse({
    status: 200,
    description: 'List of all errors',
    type: [Errors],
  })
  findAll() {
    let a = Date.UTC(2026, 1, 8);
    let b = Date.now();
    if (a !== b) throw new Error("My first Sentry error!");
    return this.errorsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an error by ID' })
  @ApiParam({ name: 'id', description: 'Error ID' })
  @ApiResponse({ status: 200, description: 'Error found', type: Errors })
  @ApiResponse({ status: 404, description: 'Error not found' })
  findOne(@Param('id') id: string) {
    return this.errorsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an error by ID' })
  @ApiParam({ name: 'id', description: 'Error ID' })
  @ApiResponse({
    status: 200,
    description: 'Error updated successfully',
    type: Errors,
  })
  @ApiResponse({ status: 404, description: 'Error not found' })
  update(@Param('id') id: string, @Body() updateErrorDto: UpdateErrorDto) {
    return this.errorsService.update(id, updateErrorDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an error by ID' })
  @ApiParam({ name: 'id', description: 'Error ID' })
  @ApiResponse({ status: 200, description: 'Error deleted successfully' })
  @ApiResponse({ status: 404, description: 'Error not found' })
  remove(@Param('id') id: string) {
    return this.errorsService.remove(id);
  }

  /** ====================== WEBHOOK ====================== */
  @Post('/webhook')
  @ApiOperation({ summary: 'Webhook endpoint' })
  @ApiResponse({ status: 200, description: 'Ok' })
  async webhook(@Body() body: any) {
    await this.errorsService.handleWebhook(body);
    return { data: "It's working!" };
  }

  /** ====================== ADVICE ====================== */
  @Post('/advice')
  @ApiOperation({ summary: 'Get AI advice for an error' })
  @ApiResponse({
    status: 200,
    description: 'AI analysis of the error',
    schema: {
      type: 'object',
      properties: {
        advice: { type: 'string' },
      },
    },
  })
  async advice(@Body() adviceErrorDto: AdviceErrorDto) {
    let errorInfoString: string;

    if (adviceErrorDto.errorId) {
      const error = await this.errorsService.findOne(adviceErrorDto.errorId);
      errorInfoString = JSON.stringify(error.data);
    } else {
      const errors = await this.errorsService.findLatest(10);
      errorInfoString = errors.map(error => JSON.stringify(error.data)).join('\n');
    }

    const advice = await this.errorsService.advice(errorInfoString);
    return { advice };
  }
}
