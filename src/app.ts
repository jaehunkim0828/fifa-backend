import express from "express";

const port = 8080;
const app = express();

app.get('/', (req, res, next): void => {
    res.send('hello world');
})

app.listen(port, () => console.log(`running ${port} port.`));