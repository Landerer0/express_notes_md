import express from 'express';
import noteRoutes from './routes/noteRoutes';
import utilsRoutes from "./routes/utilsRoutes";
import { setupSwagger } from './swagger';

const app = express();
const PORT = 3000;

setupSwagger(app);

app.use(express.json());

app.use('/api/notes', noteRoutes);
app.use("/api/utils", utilsRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
