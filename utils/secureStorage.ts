import { encryptData, decryptData } from './encryption';
import { SensitiveUserData, UserData } from './types';
import fs from 'fs';
import path from 'path';

/**
 * Secure storage service for sensitive user information
 * 
 * In a production environment, this would use a secure database with proper
 * access controls, encryption at rest, and other security measures.
 * 
 * This implementation uses file storage for demonstration purposes only.
 */

// Storage directory - in production this would be a secure database
const STORAGE_DIR = path.join(process.cwd(), 'data', 'users');
const CURRENT_ENCRYPTION_VERSION = '1.0';

// Ensure storage directory exists
if (typeof window === 'undefined') {
  try {
    if (!fs.existsSync(STORAGE_DIR)) {
      fs.mkdirSync(STORAGE_DIR, { recursive: true });
    }
  } catch (error) {
    console.error('Failed to create storage directory:', error);
  }
}

/**
 * Saves sensitive user data securely
 * @param userId - The user's ID
 * @param data - The sensitive data to store
 * @returns A promise that resolves when the data is saved
 */
export async function saveSensitiveUserData(userId: string, data: SensitiveUserData): Promise<void> {
  try {
    // Get existing user data if available
    const existingData = await getUserData(userId);
    
    // Encrypt the sensitive data
    const encryptedData = encryptData(JSON.stringify(data));
    
    // Create or update the user data
    const userData: UserData = {
      ...existingData,
      id: userId,
      email: existingData?.email || '',
      createdAt: existingData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      encryptedData,
      encryptionMetadata: {
        updatedAt: new Date().toISOString(),
        version: CURRENT_ENCRYPTION_VERSION,
      },
    };
    
    // Save the user data
    await saveUserData(userId, userData);
  } catch (error) {
    console.error('Failed to save sensitive user data:', error);
    throw new Error('Failed to save sensitive user data');
  }
}

/**
 * Retrieves sensitive user data
 * @param userId - The user's ID
 * @returns The decrypted sensitive user data, or null if not found
 */
export async function getSensitiveUserData(userId: string): Promise<SensitiveUserData | null> {
  try {
    // Get the user data
    const userData = await getUserData(userId);
    
    // If no encrypted data, return null
    if (!userData || !userData.encryptedData) {
      return null;
    }
    
    // Decrypt the data
    const decryptedData = decryptData(userData.encryptedData);
    
    // Parse and return the data
    return JSON.parse(decryptedData) as SensitiveUserData;
  } catch (error) {
    console.error('Failed to retrieve sensitive user data:', error);
    throw new Error('Failed to retrieve sensitive user data');
  }
}

/**
 * Updates specific fields in the sensitive user data
 * @param userId - The user's ID
 * @param updates - Partial updates to apply to the sensitive data
 * @returns A promise that resolves when the data is updated
 */
export async function updateSensitiveUserData(
  userId: string,
  updates: Partial<SensitiveUserData>
): Promise<void> {
  try {
    // Get existing sensitive data
    const existingData = await getSensitiveUserData(userId) || {};
    
    // Merge the updates with existing data
    const updatedData = {
      ...existingData,
      ...updates,
    };
    
    // Save the updated data
    await saveSensitiveUserData(userId, updatedData);
  } catch (error) {
    console.error('Failed to update sensitive user data:', error);
    throw new Error('Failed to update sensitive user data');
  }
}

/**
 * Deletes sensitive user data
 * @param userId - The user's ID
 * @returns A promise that resolves when the data is deleted
 */
export async function deleteSensitiveUserData(userId: string): Promise<void> {
  try {
    // Get existing user data
    const userData = await getUserData(userId);
    
    if (userData) {
      // Remove sensitive data fields
      const updatedUserData: UserData = {
        ...userData,
        encryptedData: undefined,
        encryptionMetadata: undefined,
        updatedAt: new Date().toISOString(),
      };
      
      // Save the updated user data
      await saveUserData(userId, updatedUserData);
    }
  } catch (error) {
    console.error('Failed to delete sensitive user data:', error);
    throw new Error('Failed to delete sensitive user data');
  }
}

// Helper functions for file-based storage
// In production, these would use a secure database

/**
 * Gets user data from storage
 * @param userId - The user's ID
 * @returns The user data, or null if not found
 */
async function getUserData(userId: string): Promise<UserData | null> {
  try {
    const filePath = path.join(STORAGE_DIR, `${userId}.json`);
    
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    const fileData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileData) as UserData;
  } catch (error) {
    console.error('Failed to get user data:', error);
    return null;
  }
}

/**
 * Saves user data to storage
 * @param userId - The user's ID
 * @param userData - The user data to save
 */
async function saveUserData(userId: string, userData: UserData): Promise<void> {
  try {
    const filePath = path.join(STORAGE_DIR, `${userId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(userData, null, 2));
  } catch (error) {
    console.error('Failed to save user data:', error);
    throw new Error('Failed to save user data');
  }
}
