import 'reflect-metadata';

import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

@Module({})
class TestModule {}

async function bootstrap() {
  console.log('Reflect:', typeof Reflect);
  console.log(
    'getMetadata:',
    typeof Reflect.getMetadata,
  );

  const app = await NestFactory.createApplicationContext(TestModule);

  console.log('Nest bootstrap OK');

  await app.close();
}

bootstrap().catch(console.error);
