import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { config } from '../config/config';
import { UserService } from './user.service';
import { User } from '../models/user.model';

export class AuthService {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * Generate JWT token
   * @param userId - The user ID to encode in token
   */

  private generateToken(userId: string): string {
    const secret: Secret = config.jwt.secret || 'fallback-secret';
    const options: SignOptions = {
      expiresIn: config.jwt.expiresIn as jwt.SignOptions['expiresIn'],
    };

    return jwt.sign({ userId }, secret, options);
  }

  /**
   * Hash password
   * @param password - Plain text password
   */
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  /**
   * Compare password with hash
   * @param password - Plain text password
   * @param hash - Hashed password
   */
  private async comparePassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Register new user
   * @param userData - User registration data
   */
  async signup(
    userData: Omit<User, 'createdAt' | 'updatedAt'>
  ): Promise<{ user: User; token: string }> {
    const hashedPassword = await this.hashPassword(userData.password);
    const user = await this.userService.createUser({
      ...userData,
      password: hashedPassword,
    });
    const token = this.generateToken((user as any)._id.toString());
    return { user, token };
  }

  /**
   * Login user
   * @param email - User email
   * @param password - User password
   */
  async login(
    email: string,
    password: string
  ): Promise<{ user: User; token: string }> {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await this.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken((user as any)._id.toString());
    return { user, token };
  }
}
