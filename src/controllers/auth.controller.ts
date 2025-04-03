import { Request, Response } from 'express';
import { z } from 'zod';
import { AuthService } from '../services/auth.service';

// Validation schemas
const signupSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  bio: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Handle user signup
   */
  signup = async (req: Request, res: Response): Promise<void> => {
    try {
      const userData = signupSchema.parse(req.body);
      const { user, token } = await this.authService.signup(userData);

      // Remove password from response
      const { password, ...userWithoutPassword } = user;

      res.status(201).json({
        user: userWithoutPassword,
        token,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
        return;
      }
      res.status(400).json({ error: 'Registration failed' });
    }
  };

  /**
   * Handle user login
   */
  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const credentials = loginSchema.parse(req.body);
      const { user, token } = await this.authService.login(
        credentials.email,
        credentials.password
      );

      // Remove password from response
      const { password, ...userWithoutPassword } = user;

      res.json({
        user: userWithoutPassword,
        token,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
        return;
      }
      res.status(401).json({ error: 'Invalid credentials' });
    }
  };
}
