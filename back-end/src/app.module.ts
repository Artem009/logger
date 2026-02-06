import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ErrorsModule } from './errors/errors.module';
import { Error } from './errors/entities/error.entity';
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [Error],
      synchronize: false,
      migrations: ['dist/migrations/*.js'],
      migrationsRun: false,
    }),
    ErrorsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
