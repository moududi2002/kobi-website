// apps/api/src/config/configuration.ts

export default () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.API_PORT || '4000', 10),
  apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:4000',

  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/kobi_website',
  },

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET!,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET!,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  admin: {
    email: process.env.ADMIN_EMAIL!,
    password: process.env.ADMIN_PASSWORD!,
    name: process.env.ADMIN_NAME || 'Admin',
  },

  cors: {
    origins: (process.env.CORS_ORIGINS || 'http://localhost:3000').split(','),
  },

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  },

  preview: {
    tokenSecret: process.env.PREVIEW_TOKEN_SECRET!,
    expiresIn: process.env.PREVIEW_TOKEN_EXPIRES_IN || '24h',
  },
});