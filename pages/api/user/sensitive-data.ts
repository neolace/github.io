import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { ApiResponse, SensitiveUserData } from '../../../utils/types';
import { 
  getSensitiveUserData, 
  saveSensitiveUserData, 
  updateSensitiveUserData, 
  deleteSensitiveUserData 
} from '../../../utils/secureStorage';

/**
 * API handler for managing sensitive user data
 * Supports GET, POST, PATCH, and DELETE methods
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    // Get the user's session
    const session = await getSession({ req });
    
    // Check if the user is authenticated
    if (!session || !session.user?.id) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: You must be logged in to access this resource',
      });
    }
    
    const userId = session.user.id;
    
    // Handle different HTTP methods
    switch (req.method) {
      case 'GET':
        return await handleGetData(userId, res);
      case 'POST':
        return await handleSaveData(userId, req.body, res);
      case 'PATCH':
        return await handleUpdateData(userId, req.body, res);
      case 'DELETE':
        return await handleDeleteData(userId, res);
      default:
        return res.status(405).json({
          success: false,
          error: 'Method not allowed',
        });
    }
  } catch (error) {
    console.error('Error handling sensitive data request:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

/**
 * Handles GET requests to retrieve sensitive user data
 */
async function handleGetData(
  userId: string,
  res: NextApiResponse<ApiResponse>
) {
  try {
    const sensitiveData = await getSensitiveUserData(userId);
    
    return res.status(200).json({
      success: true,
      data: sensitiveData || {},
    });
  } catch (error) {
    console.error('Error retrieving sensitive data:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve sensitive data',
    });
  }
}

/**
 * Handles POST requests to save new sensitive user data
 */
async function handleSaveData(
  userId: string,
  data: SensitiveUserData,
  res: NextApiResponse<ApiResponse>
) {
  try {
    // Validate the data
    if (!data || typeof data !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Invalid data format',
      });
    }
    
    // Save the data
    await saveSensitiveUserData(userId, data);
    
    return res.status(201).json({
      success: true,
      data: { message: 'Sensitive data saved successfully' },
    });
  } catch (error) {
    console.error('Error saving sensitive data:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to save sensitive data',
    });
  }
}

/**
 * Handles PATCH requests to update existing sensitive user data
 */
async function handleUpdateData(
  userId: string,
  updates: Partial<SensitiveUserData>,
  res: NextApiResponse<ApiResponse>
) {
  try {
    // Validate the updates
    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Invalid update format',
      });
    }
    
    // Update the data
    await updateSensitiveUserData(userId, updates);
    
    return res.status(200).json({
      success: true,
      data: { message: 'Sensitive data updated successfully' },
    });
  } catch (error) {
    console.error('Error updating sensitive data:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update sensitive data',
    });
  }
}

/**
 * Handles DELETE requests to remove sensitive user data
 */
async function handleDeleteData(
  userId: string,
  res: NextApiResponse<ApiResponse>
) {
  try {
    // Delete the data
    await deleteSensitiveUserData(userId);
    
    return res.status(200).json({
      success: true,
      data: { message: 'Sensitive data deleted successfully' },
    });
  } catch (error) {
    console.error('Error deleting sensitive data:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete sensitive data',
    });
  }
}
