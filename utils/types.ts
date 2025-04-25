/**
 * Type definitions for user data and sensitive information
 */

// Basic user profile information
export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

// Sensitive user information that needs to be encrypted
export interface SensitiveUserData {
  // Personal information
  fullName?: string;
  dateOfBirth?: string;
  ssn?: string; // Social Security Number (or equivalent)
  nationalId?: string;
  
  // Contact information
  phoneNumber?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  
  // Financial information
  paymentMethods?: {
    id: string;
    type: 'credit_card' | 'bank_account' | 'paypal' | 'other';
    lastFour?: string; // Last four digits (not encrypted)
    holderName?: string; // Encrypted
    expiryDate?: string; // Encrypted
    // Full card numbers and security codes should never be stored, even encrypted
  }[];
  
  // Health information (if applicable)
  healthInfo?: {
    medicalConditions?: string[];
    allergies?: string[];
    medications?: string[];
  };
  
  // Custom fields for application-specific sensitive data
  customFields?: Record<string, string>;
}

// User data with encrypted sensitive information
export interface UserData extends UserProfile {
  // Encrypted sensitive data (stored as a string)
  encryptedData?: string;
  
  // Metadata about the encrypted data
  encryptionMetadata?: {
    updatedAt: string;
    version: string;
  };
}

// Session with extended user information
export interface ExtendedSession {
  user: {
    id: string;
    name?: string;
    email?: string;
    image?: string;
  };
  expires: string;
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
