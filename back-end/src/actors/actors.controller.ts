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
import { ActorsService } from './actors.service';
import { CreateActorDto } from './dto/create-actor.dto';
import { UpdateActorDto } from './dto/update-actor.dto';
import { Actor } from './entities/actor.entity';

@ApiTags('actors')
@Controller('actors')
export class ActorsController {
  constructor(private readonly actorsService: ActorsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new actor' })
  @ApiResponse({ status: 201, description: 'Actor created successfully', type: Actor })
  create(@Body() createActorDto: CreateActorDto) {
    return this.actorsService.create(createActorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all actors' })
  @ApiResponse({ status: 200, description: 'List of all actors', type: [Actor] })
  findAll() {
    return this.actorsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an actor by ID' })
  @ApiParam({ name: 'id', description: 'Actor ID' })
  @ApiResponse({ status: 200, description: 'Actor found', type: Actor })
  @ApiResponse({ status: 404, description: 'Actor not found' })
  findOne(@Param('id') id: string) {
    return this.actorsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an actor by ID' })
  @ApiParam({ name: 'id', description: 'Actor ID' })
  @ApiResponse({ status: 200, description: 'Actor updated successfully', type: Actor })
  @ApiResponse({ status: 404, description: 'Actor not found' })
  update(@Param('id') id: string, @Body() updateActorDto: UpdateActorDto) {
    return this.actorsService.update(+id, updateActorDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an actor by ID' })
  @ApiParam({ name: 'id', description: 'Actor ID' })
  @ApiResponse({ status: 200, description: 'Actor deleted successfully' })
  @ApiResponse({ status: 404, description: 'Actor not found' })
  remove(@Param('id') id: string) {
    return this.actorsService.remove(+id);
  }
}
