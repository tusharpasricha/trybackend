const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config({
  path: '../.env'
});

const authRoutes = require('./routes/auth');
const connectDB = require('./db');

const app = express();
app.use(cors());
const port = process.env.PORT || 8001;

console.log(process.env.PORT)

connectDB();

// mongoose
//   .connect(process.env.MONGO,{
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log('DB Connected'));


app.use(bodyParser.json());

app.use('/api', authRoutes);
app.listen(port, () => {
  console.log(`Server is running on ${port}`)
});