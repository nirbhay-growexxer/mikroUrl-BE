import { Request } from 'express';

/**
 * Extended Express Request interface that includes user authentication data
 */
export interface AuthRequest extends Request {
  /**
   * The authenticated user's information
   */
  userId: string;
}
