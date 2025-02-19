import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import featureFlagRoutes from './routes/featureFlagRoutes';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', featureFlagRoutes);

export default app;
