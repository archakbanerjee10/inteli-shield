import axios from 'axios';
import { adaptScanResult } from '../utils/adapter';
// Automatically reads from your .env files or defaults to localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export const scanTarget = async (target) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/v1/scan`, {
      target: target,
    });
    return adaptScanResult(response.data);
  } catch (error) {
    console.error('API connection error:', error);
    throw error;
  }
};