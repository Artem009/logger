import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

const isSSLRequired = process.env.DATABASE_SSLMODE === 'require';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  ssl: isSSLRequired ? { rejectUnauthorized: false } : false,
});
