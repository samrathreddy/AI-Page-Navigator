import express from 'express';
import speechRoutes from './speech.routes';
import intentRoutes from './intent.routes';

const router = express.Router();

// Health check route for API
router.get('/', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API is running' });
});

// Register routes
router.use('/speech', speechRoutes);
router.use('/intent', intentRoutes);

export default router; 