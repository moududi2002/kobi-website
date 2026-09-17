// apps/api/src/database/database.module.ts

import { Module, Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ModelsModule } from './models.module';


@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const uri = config.get<string>('database.uri')!;

        const logger = new Logger('MongoDB');

        return {
          uri,
          connectionFactory: (connection) => {
            connection.on('connected', () => {
              logger.log(`✅ MongoDB connected: ${connection.name}`);
            });

            connection.on('error', (err: Error) => {
              logger.error(`❌ MongoDB error: ${err.message}`);
            });

            connection.on('disconnected', () => {
              logger.warn('⚠️ MongoDB disconnected');
            });

            return connection;
          },
        };
      },
    }),
    ModelsModule,
  ],
  exports: [ModelsModule],
})
export class DatabaseModule {}
