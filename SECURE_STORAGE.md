# Secure Storage for Sensitive User Information

This document provides an overview of the secure storage system implemented for handling sensitive user information.

## Overview

The secure storage system provides:

1. **End-to-end encryption** of sensitive user data
2. **Secure API endpoints** for managing sensitive data
3. **Client-side hooks** for easy integration
4. **Data validation** to ensure proper formatting
5. **Access control** to prevent unauthorized access

## Security Features

- **AES-256-GCM encryption** for confidentiality and integrity
- **PBKDF2 password hashing** with secure salting
- **Authentication checks** on all sensitive data endpoints
- **Secure key management** with environment variables
- **Data minimization** principles applied to storage

## Setup Instructions

### 1. Generate an Encryption Key

Run the provided script to generate a secure encryption key:

```bash
node scripts/generate-encryption-key.js
```

### 2. Configure Environment Variables

Add the generated encryption key to your `.env.local` file:

```
ENCRYPTION_KEY=your_generated_key
```

### 3. Create Data Directory

The system will automatically create a `data/users` directory for storing encrypted user data. In production, you should use a secure database instead.

## Usage

### Server-side API

The system provides RESTful API endpoints for managing sensitive data:

- `GET /api/user/sensitive-data` - Retrieve sensitive data
- `POST /api/user/sensitive-data` - Save new sensitive data
- `PATCH /api/user/sensitive-data` - Update existing sensitive data
- `DELETE /api/user/sensitive-data` - Delete sensitive data

### Client-side Hook

Use the `useSensitiveData` hook in your components:

```tsx
import { useSensitiveData } from '../hooks/useSensitiveData';

function ProfileComponent() {
  const { 
    data, 
    isLoading, 
    error, 
    fetchData, 
    saveData, 
    updateData, 
    deleteData 
  } = useSensitiveData();

  // Example: Load data on component mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Example: Update specific fields
  const updatePhoneNumber = async (phoneNumber) => {
    await updateData({ phoneNumber });
  };

  // Render component...
}
```

## Security Best Practices

1. **Never store encryption keys in code or commit them to version control**
2. **Rotate encryption keys periodically** (requires data re-encryption)
3. **Implement proper access controls** based on user roles
4. **Log access attempts** to sensitive data for audit purposes
5. **Regularly backup encrypted data** but ensure backups are also secured
6. **Implement rate limiting** on sensitive data endpoints
7. **Use HTTPS** for all API communications
8. **Consider adding multi-factor authentication** for sensitive operations

## Production Considerations

For production environments:

1. Replace file-based storage with a secure database
2. Implement proper key management using a service like AWS KMS or HashiCorp Vault
3. Add audit logging for all sensitive data operations
4. Implement data retention policies and automatic purging
5. Consider using a Web Application Firewall (WAF) for additional protection
6. Regularly perform security audits and penetration testing

## Data Structure

The system handles the following types of sensitive information:

- Personal identification (name, DOB, SSN, etc.)
- Contact information (phone, address)
- Financial information (payment methods)
- Health information (if applicable)
- Custom fields for application-specific data

All sensitive data is encrypted before storage and only decrypted when needed.
