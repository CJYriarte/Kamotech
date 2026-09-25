import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js'
import staffRoutes from './routes/staffRoutes.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(express.json());

//This part register the API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/staff', staffRoutes);

app.get('/api/v1/health', (req, res) => {
    res.status(200).json({status: 'ok', service: 'SkySurfers Backend API'});
});

app.listen(PORT, () => {
    console.log(`[SkySurfers Server] Running on port ${PORT}`);
});
