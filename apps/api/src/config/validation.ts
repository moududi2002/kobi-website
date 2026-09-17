// apps/api/src/config/validation.ts

import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  API_PORT: Joi.number().default(4000),
  API_BASE_URL: Joi.string().uri().required(),

  MONGODB_URI: Joi.string().required(),

  JWT_ACCESS_SECRET: Joi.string().min(32).required(),
  JWT_ACCESS_EXPIRES_IN: Joi.string().default('15m'),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),

  ADMIN_EMAIL: Joi.string().email().required(),
  ADMIN_PASSWORD: Joi.string().min(6).required(),
  ADMIN_NAME: Joi.string().required(),

  CORS_ORIGINS: Joi.string().required(),

  CLOUDINARY_CLOUD_NAME: Joi.string().allow('').default(''),
  CLOUDINARY_API_KEY: Joi.string().allow('').default(''),
  CLOUDINARY_API_SECRET: Joi.string().allow('').default(''),

  PREVIEW_TOKEN_SECRET: Joi.string().min(16).required(),
  PREVIEW_TOKEN_EXPIRES_IN: Joi.string().default('24h'),
});