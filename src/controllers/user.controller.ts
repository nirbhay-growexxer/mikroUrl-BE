import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { UserSchema, UserModel } from '../models/user.model';
import { User } from '../models/user.model';

// Add this interface to extend the Express Request type
interface AuthRequest extends Request {
  userId: string;
}

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * Create user handler
   */
  createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const userData = UserSchema.parse(req.body);
      const user = await this.userService.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: 'Invalid user data' });
    }
  };

  /**
   * Get user handler
   */
  getUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.userService.getUserById(req.params.id);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };

  /**
   * Get the profile of the authenticated user
   * @param req - Express request object with user ID from auth token
   * @param res - Express response object
   */
  public getUserProfile = async (
    req: AuthRequest,
    res: Response
  ): Promise<void> => {
    try {
      // The userId should be attached to req by the authMiddleware
      const userId = req.userId;

      const user = await UserModel.findById(userId).select('-password');

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.status(200).json({ user });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  /**
   * Update the profile of the authenticated user
   * @param req - Express request object with user ID from auth token and updated profile data
   * @param res - Express response object
   */
  public updateUserProfile = async (
    req: AuthRequest,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.userId;
      const { name, email, bio } = req.body;

      // Find user and update with new data
      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        {
          $set: {
            name,
            email,
            bio,
            updatedAt: new Date(),
          },
        },
        { new: true }
      ).select('-password');

      if (!updatedUser) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.status(200).json({
        message: 'Profile updated successfully',
        user: updatedUser,
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  /**
   * Delete the account of the authenticated user
   * @param req - Express request object with user ID from auth token
   * @param res - Express response object
   */
  public deleteUserAccount = async (
    req: AuthRequest,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.userId;

      const deletedUser = await UserModel.findByIdAndDelete(userId);

      if (!deletedUser) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
      console.error('Error deleting user account:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
}
