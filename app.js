require('dotenv').config();
require('express-async-errors');

//express
const express = require('express');
const app = express();

// Connect to MongoDB
const connectDB = require('./db/connect');

//routers
const authRouter = require('./routes/AuthRoutes');
const journalRouter = require('./routes/JournalRoutes');


app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/journal', journalRouter);

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