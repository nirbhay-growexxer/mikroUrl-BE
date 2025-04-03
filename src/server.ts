import { createApp } from './app';
import mongoose from 'mongoose';
import { config } from './config/config';

// Enable debug logs by default for API requests
// If DEBUG env var is already set, keep it, otherwise set it to include api:request
process.env.DEBUG = process.env.DEBUG || 'api:request';

// In development, enable more verbose logging
if (process.env.NODE_ENV === 'development') {
  // Add performance logging in development if not explicitly disabled
  if (!process.env.DEBUG.includes('api:performance')) {
    process.env.DEBUG += ',api:performance';
  }
}

const startServer = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoose.url);
    console.log('Connected to MongoDB');

    const app = createApp();
    const server = app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
      console.log(`Debug logging enabled: ${process.env.DEBUG}`);
    });

    // Handle graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully');
      server.close(() => {
        console.log('Server closed');
        mongoose.connection.close().then(() => {
          console.log('MongoDB connection closed');
          process.exit(0);
        });
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
