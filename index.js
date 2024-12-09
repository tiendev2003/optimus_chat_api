const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose'); // Add mongoose for MongoDB connection
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

dotenv.config();

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI ).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// cấu hình ejs để sử dụng template engine
app.set('view engine', 'ejs');
app.set('views', './templates');

  
app.use('/api', routes);

app.use(errorHandler);
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});