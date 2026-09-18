// apps/api/src/common/utils/token.util.ts
import { createHash, randomBytes } from 'crypto';

/**
 * Generate a cryptographically strong random refresh token (raw).
 * This is what will be sent to the client in the cookie.
 */
export function generateRefreshTokenRaw(): string {
  return randomBytes(64).toString('hex');
}

/**
 * SHA-256 hash used for storage in DB.
 * Never store the raw refresh token.
 */
export function hashToken(raw: string): string {
  return createHash('sha256').update(raw).digest('hex');
}

/**
 * Parse a duration string like "15m", "7d", "12h", "3600s"
 * into milliseconds. Falls back to 0 on parse failure.
 */
export function parseDurationMs(duration: string): number {
  const match = /^(\d+)\s*(ms|s|m|h|d)$/.exec(duration.trim());
  if (!match) return 0;
  const value = parseInt(match[1], 10);
  const unit = match[2];
  const multipliers: Record<string, number> = {
    ms: 1,
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };
  return value * multipliers[unit];
}