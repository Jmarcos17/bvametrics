import { randomBytes } from 'crypto';

/**
 * Generate a unique token for client connection links
 */
export function generateClientToken(): string {
  return randomBytes(32).toString('hex');
}

