import express from 'express';
import uploadRouter from './routes/upload';
import matchingRouter from './routes/matching';
import storesRouter from './routes/stores';
import feedbackRouter from './routes/feedback';
import resultsRouter from './routes/results';
import recommendationsRouter from './routes/recommendations';
import monitoringRouter from './routes/monitoring';
import analyticsRouter from './routes/analytics';
import abTestingRouter from './routes/abTesting';
import notificationsRouter from './routes/notifications';
import { errorHandler } from './middleware/errorHandler';
import { initializePinecone } from './services/similaritySearch';
import { notificationService } from './services/notificationService';

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Routes
app.use('/api', uploadRouter);
app.use('/api/matching', matchingRouter);
app.use('/api/stores', storesRouter);
app.use('/api/feedback', feedbackRouter);
app.use('/api/results', resultsRouter);
app.use('/api/recommendations', recommendationsRouter);
app.use('/api/monitoring', monitoringRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/ab-testing', abTestingRouter);
app.use('/api/notifications', notificationsRouter);

// Global error handler
app.use(errorHandler);

// Schedule notification checks
setInterval(() => {
  notificationService.checkWishlistAlerts().catch(console.error);
}, 15 * 60 * 1000); // Check every 15 minutes

// Initialize services
initializePinecone().catch(console.error);

export default app;