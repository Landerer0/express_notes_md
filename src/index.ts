import express from 'express';
import noteRoutes from './routes/noteRoutes';
import utilsRoutes from "./routes/utilsRoutes";
import authRoutes from "./routes/authRoutes";
import { setupSwagger } from './swagger';
import cookieParser from 'cookie-parser'
import helmet from "helmet";

const app = express();
const PORT = 3000;
const FRONTEND_URL = "http://localhost:5173";

setupSwagger(app);

app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'"],
//       scriptSrc: ["'self'", "https://cdn.jsdelivr.net"], 
//       styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
//       fontSrc: ["'self'", "https://fonts.gstatic.com"],
//       imgSrc: ["'self'", "data:"],
//       connectSrc: ["'self'", FRONTEND_URL],
//       objectSrc: ["'none'"],
//       upgradeInsecureRequests: [],
//     },
//   })
// );

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use("/api/utils", utilsRoutes);


app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
