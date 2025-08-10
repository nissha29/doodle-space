import express, { Express } from 'express'
import userRouter from './routers/user.route.js';
import roomRouter from './routers/room.route.js';
import dotenv from 'dotenv'
import cors from 'cors'

const app: Express = express();
const allowedOrigins = [
  'http://localhost:3002', 
  'https://dooodle-space.vercel.app', 
  'https://doodlespace.xyz',
  'https://www.doodlespace.xyz'
];

const corsOptions = {
  origin: function (origin: any, callback: any) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'authorization'] 
};

app.use(cors(corsOptions));
app.use(express.json());
dotenv.config();

app.get('/', (req, res) => {
    res.json({ message: `Hello World` })
})

app.use('/user', userRouter);
app.use('/room', roomRouter);

app.listen(8000, () => {
    console.log(`Server Started`)
});

export default app;