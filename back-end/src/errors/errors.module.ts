import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErrorsService } from './errors.service';
import { ErrorsController } from './errors.controller';
import { Error } from './entities/error.entity';
import { ActorsModule } from '../actors/actors.module';

@Module({
  imports: [TypeOrmModule.forFeature([Error]), ActorsModule],
  controllers: [ErrorsController],
  providers: [ErrorsService],
})
export class ErrorsModule {}
