import express from 'express';
import noteRoutes from './routes/noteRoutes';
import utilsRoutes from "./routes/utilsRoutes";
import authRoutes from "./routes/authRoutes";
import { setupSwagger } from './swagger';
import cookieParser from 'cookie-parser';

import { authMiddleware } from './middleware/authMiddleware';


const app = express();
const PORT = 3000;

setupSwagger(app);

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use("/api/utils", utilsRoutes);


app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
