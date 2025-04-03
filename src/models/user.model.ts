import { Schema, model, Document } from 'mongoose';
import { z } from 'zod';

// Zod schema for validation
export const UserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(6),
  bio: z.string().optional(),
  createdAt: z.date(),
});

// TypeScript type inference from Zod schema
export type User = z.infer<typeof UserSchema>;

// Mongoose schema
const userSchema = new Schema<User>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    bio: { type: String, required: false },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const UserModel = model<User>('User', userSchema);
