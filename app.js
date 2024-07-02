require('dotenv').config();
require('express-async-errors');

//express
const express = require('express');
const app = express();

// Connect to MongoDB
const connectDB = require('./db/connect');

//routers
const authRouter = require('./routes/AuthRoutes');



app.use(express.json());
app.use('/api/auth', authRouter);

app.get('/', (req,res) => {
    res.send('Hello, World!');
})


const port = process.env.PORT || 5000;;
const start = async () => {
    try {
      await connectDB(process.env.MONGO_URI)
       app.listen(port, () => console.log(`Server running on port ${port}`));
    } catch (error) {
        console.error(`Error starting the server: ${error.message}`);
    }
}
start();