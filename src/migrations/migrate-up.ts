import { connectDatabase } from '../config/database';
import { UserModel } from '../models/user.model';

const up = async () => {
  try {
    await connectDatabase();

    // Add migration logic here
    // Example: Add an index
    await UserModel.collection.createIndex({ email: 1 }, { unique: true });

    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

up();
