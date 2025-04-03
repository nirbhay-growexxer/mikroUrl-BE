import { UserModel, User } from '../models/user.model';

export class UserService {
  /**
   * Create a new user
   * @param userData - The user data
   * @returns The created user
   */
  async createUser(
    userData: Omit<User, 'createdAt' | 'updatedAt'>
  ): Promise<User> {
    const user = await UserModel.create(userData);
    return user.toObject();
  }

  /**
   * Get user by ID
   * @param id - The user ID
   * @returns The user if found
   */
  async getUserById(id: string): Promise<User | null> {
    const user = await UserModel.findById(id);
    return user?.toObject() ?? null;
  }

  /**
   * Get user by email
   * @param email - The user email
   */
  async getUserByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email });
    return user?.toObject() ?? null;
  }
}
