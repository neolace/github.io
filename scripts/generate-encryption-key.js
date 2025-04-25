/**
 * Script to generate a secure encryption key for sensitive data
 * Run this script with: node scripts/generate-encryption-key.js
 */

const crypto = require('crypto');

// Generate a secure random encryption key (32 bytes = 256 bits)
const encryptionKey = crypto.randomBytes(32).toString('hex');

console.log('\n=== SECURE ENCRYPTION KEY ===');
console.log(encryptionKey);
console.log('\nAdd this key to your .env.local file as:');
console.log(`ENCRYPTION_KEY=${encryptionKey}`);
console.log('\nWARNING: Keep this key secure and never commit it to version control!');
console.log('If this key is lost, all encrypted data will be unrecoverable.\n');
