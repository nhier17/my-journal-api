require('dotenv').config();
require('express-async-errors');

//express
const express = require('express');
const app = express();
//rest of packages
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');

// Connect to MongoDB
const connectDB = require('./db/connect');

//routers
const authRouter = require('./routes/AuthRoutes');
const journalRouter = require('./routes/JournalRoutes');

//middleware
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(cookieParser(process.env.JWT_SECRET));
app.use('/uploads',express.static('uploads'));

app.use('/api/auth', authRouter);
app.use('/api/journal', journalRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);



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