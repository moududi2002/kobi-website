// apps/api/src/common/pipes/validation.pipe.ts
import { ValidationPipe } from '@nestjs/common';

/**
 * Reusable validation pipe factory with our project defaults.
 * (We already register one globally in main.ts — this is for special cases.)
 */
export const createValidationPipe = () =>
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  });