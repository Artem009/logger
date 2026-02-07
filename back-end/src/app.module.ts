import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ErrorsModule } from './errors/errors.module';
import { Errors } from './errors/entities/error.entity';
import { ActorsModule } from './actors/actors.module';
import { Actor } from './actors/entities/actor.entity';
import { SentryModule } from '@sentry/nestjs/setup';
import { SentryGlobalFilter } from '@sentry/nestjs/setup';
import {APP_FILTER} from "@nestjs/core";

@Module({
  imports: [
    SentryModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isSSLRequired =
          configService.get<string>('DATABASE_SSLMODE') === 'require';
        return {
          type: 'postgres',
          host: configService.get<string>('DATABASE_HOST'),
          port: configService.get<number>('DATABASE_PORT'),
          username: configService.get<string>('DATABASE_USER'),
          password: configService.get<string>('DATABASE_PASSWORD'),
          database: configService.get<string>('DATABASE_NAME'),
          entities: [Errors, Actor],
          synchronize: false,
          migrations: ['dist/migrations/*.js'],
          migrationsRun: false,
          ssl: isSSLRequired ? { rejectUnauthorized: false } : false,
        };
      },
    }),
    ErrorsModule,
    ActorsModule,
  ],
  controllers: [AppController],
  providers: [
      {
        provide: APP_FILTER,
        useClass: SentryGlobalFilter,
      },
    AppService
  ],
})
export class AppModule {}
