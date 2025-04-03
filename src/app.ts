import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { userRouter } from './routes/user.routes';
import { authRouter } from './routes/auth.routes';
import morgan from 'morgan';
import debug from 'debug';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger';

// Create debug loggers
const apiLogger = debug('api:request');
const perfLogger = debug('api:performance');

export const createApp = () => {
  const app = express();

  // Middleware
  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  // Swagger documentation
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'MikroURL API Documentation',
    })
  );

  // Request logging middleware
  app.use((req, res, next) => {
    const start = Date.now();

    // Log request details
    apiLogger(
      `${req.method} ${req.url} - Body: %O, Query: %O`,
      req.body,
      req.query
    );

    next();
  });

  // Add morgan for standard HTTP logging in development
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  // Routes
  app.use('/api/auth', authRouter);
  app.use('/api/users', userRouter);

  // Error handling middleware
  app.use(
    (
      err: Error,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      console.error(err.stack);
      apiLogger('Error: %O', err);
      res.status(500).json({ error: 'Something broke!' });
    }
  );

  return app;
};
