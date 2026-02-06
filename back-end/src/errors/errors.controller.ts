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
import { Error } from './entities/error.entity';

@ApiTags('errors')
@Controller('errors')
export class ErrorsController {
  constructor(private readonly errorsService: ErrorsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new error' })
  @ApiResponse({
    status: 201,
    description: 'Error created successfully',
    type: Error,
  })
  create(@Body() createErrorDto: CreateErrorDto) {
    return this.errorsService.create(createErrorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all errors' })
  @ApiResponse({
    status: 200,
    description: 'List of all errors',
    type: [Error],
  })
  findAll() {
    return this.errorsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an error by ID' })
  @ApiParam({ name: 'id', description: 'Error ID' })
  @ApiResponse({ status: 200, description: 'Error found', type: Error })
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
    type: Error,
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
  async webhook(@Body() data: any) {
    await this.errorsService.create({ data });
    return { data: "It's working!" };
  }
}
