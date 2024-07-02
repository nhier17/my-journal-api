require('dotenv').config();
require('express-async-errors');

//express

const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req,res) => {
    res.send('Hello, World!');
})


const port = process.env.PORT || 5000;;
const start = async () => {
    try {
      await app.listen(port, () => console.log(`Server running on port ${port}`));
    } catch (error) {
        console.error(`Error starting the server: ${error.message}`);
    }
}
start();