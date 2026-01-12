import express, { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';

declare module 'express-session' {
  interface SessionData {
    isLoggedIn?: boolean;
    userId?: string;
  }
}

const app = express();

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24**7, // 7 days
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    },
  })
);

const port = Number(process.env.PORT) || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Server is Live!');
});

const startServer = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
};

startServer();
