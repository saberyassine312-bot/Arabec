import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import apiRouter, { setSocketIO } from './backend/routes/api';
import ltiRouter from './backend/routes/ltiRoutes';
import { seedDatabase } from './backend/db/seeder';

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const io = new SocketIOServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT']
    }
  });

  const PORT = 3000;

  // Parse application/json
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Ensure Database has been seeded
  try {
    seedDatabase();
  } catch (error) {
    console.error('Failed to run local database seeder:', error);
  }

  // Realtime Events connection registry
  io.on('connection', (socket) => {
    console.log(`Client logged into realtime classroom portal: ${socket.id}`);
    
    socket.on('join-student', (studentId) => {
      socket.join(`student_${studentId}`);
    });

    socket.on('join-class', (className) => {
      socket.join(className);
    });

    socket.on('disconnect', () => {
      console.log(`Client logged out from realtime classroom portal: ${socket.id}`);
    });
  });

  // Inject Socket.io reference in router
  setSocketIO(io);

  // Mount API Endpoints
  app.use('/api', apiRouter);
  app.use('/api/lti', ltiRouter);

  // Integrate Vite dev server middleware or static production handler
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: express.Request, res: express.Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
  
  // Also bind to 0.0.0.0 for actual container host mapping as requested
  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.log('Port already in use.');
    } else {
      console.error('Server error:', err);
    }
  });
}

startServer().catch((error) => {
  console.error('Error starting school LMS server:', error);
});
export {};
