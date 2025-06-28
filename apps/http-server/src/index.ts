import express from 'express';
import dotenv from 'dotenv'

const app = express();
dotenv.config();

app.get('/', ({ req, res}: any) => {
    return res.json({
        message: `Hello World`
    })
})

app.listen(8000, () => {
    console.log(`Server Started`)
});