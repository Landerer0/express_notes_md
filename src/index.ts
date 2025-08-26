import express from 'express';
import noteRoutes from './routes/noteRoutes';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/api/notes', noteRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
