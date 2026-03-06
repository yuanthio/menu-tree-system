import { Injectable } from '@nestjs/common';

@Injectable()
export class DatabaseConfig {
  get databaseUrl(): string | undefined {
    return process.env.DATABASE_URL || '';
  }
}