import crypto from 'crypto';

/**
 * Encryption utilities for sensitive user data
 * Uses AES-256-GCM encryption which provides both confidentiality and integrity
 */

// Environment variables should be set in .env.local
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '';
const ENCRYPTION_IV_LENGTH = 16;
const ENCRYPTION_TAG_LENGTH = 16;
const ENCRYPTION_ALGORITHM = 'aes-256-gcm';

/**
 * Encrypts sensitive data
 * @param data - The data to encrypt
 * @returns The encrypted data as a string in format: iv:encryptedData:authTag
 */
export function encryptData(data: string): string {
  if (!ENCRYPTION_KEY) {
    throw new Error('ENCRYPTION_KEY environment variable is not set');
  }

  // Generate a random initialization vector
  const iv = crypto.randomBytes(ENCRYPTION_IV_LENGTH);
  
  // Create cipher with key, iv, and algorithm
  const cipher = crypto.createCipheriv(
    ENCRYPTION_ALGORITHM,
    Buffer.from(ENCRYPTION_KEY, 'hex'),
    iv
  );
  
  // Encrypt the data
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  // Get the authentication tag
  const authTag = cipher.getAuthTag().toString('hex');
  
  // Return iv:encryptedData:authTag
  return `${iv.toString('hex')}:${encrypted}:${authTag}`;
}

/**
 * Decrypts sensitive data
 * @param encryptedData - The encrypted data in format: iv:encryptedData:authTag
 * @returns The decrypted data as a string
 */
export function decryptData(encryptedData: string): string {
  if (!ENCRYPTION_KEY) {
    throw new Error('ENCRYPTION_KEY environment variable is not set');
  }

  // Split the encrypted data into iv, data, and authTag
  const [ivHex, encrypted, authTagHex] = encryptedData.split(':');
  
  if (!ivHex || !encrypted || !authTagHex) {
    throw new Error('Invalid encrypted data format');
  }
  
  // Convert hex strings back to buffers
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  
  // Create decipher
  const decipher = crypto.createDecipheriv(
    ENCRYPTION_ALGORITHM,
    Buffer.from(ENCRYPTION_KEY, 'hex'),
    iv
  );
  
  // Set auth tag
  decipher.setAuthTag(authTag);
  
  // Decrypt the data
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

/**
 * Generates a secure encryption key
 * This should be used once to generate a key to set in environment variables
 * @returns A secure encryption key as a hex string
 */
export function generateEncryptionKey(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Hashes a password using PBKDF2
 * @param password - The password to hash
 * @param salt - Optional salt, if not provided a new one will be generated
 * @returns An object containing the hash and salt
 */
export function hashPassword(password: string, existingSalt?: string): { hash: string; salt: string } {
  const salt = existingSalt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

/**
 * Verifies a password against a hash
 * @param password - The password to verify
 * @param hash - The stored hash
 * @param salt - The salt used to create the hash
 * @returns True if the password matches, false otherwise
 */
export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const { hash: calculatedHash } = hashPassword(password, salt);
  return calculatedHash === hash;
}
