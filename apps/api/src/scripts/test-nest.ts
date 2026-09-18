import 'reflect-metadata';

import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

@Module({})
class TestModule {}

async function main() {
  console.log('1. metadata:', typeof Reflect.getMetadata);
  console.log('2. module:', TestModule);

  const app = await NestFactory.createApplicationContext(TestModule);

  console.log('3. NEST OK');

  await app.close();
}

main().catch(console.error);
