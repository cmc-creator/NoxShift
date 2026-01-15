import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'NoxShift API is running' });
});

// Employee routes
app.get('/api/employees', (req, res) => {
  res.json({ employees: [] });
});

// Schedule routes
app.get('/api/schedules', (req, res) => {
  res.json({ schedules: [] });
});

// Time off routes
app.get('/api/timeoff', (req, res) => {
  res.json({ requests: [] });
});

app.listen(PORT, () => {
  console.log(`✅ NoxShift server running on port ${PORT}`);
});
