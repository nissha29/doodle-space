import express from 'express'
import userRouter from './routers/user.route.js';
import roomRouter from './routers/room.route.js';
import dotenv from 'dotenv'
import cors from 'cors'

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

app.get('/', (req, res) => {
    res.json({ message: `Hello World` })
})

app.use('/user', userRouter);
app.use('/room', roomRouter);

app.listen(8000, () => {
    console.log(`Server Started`)
});