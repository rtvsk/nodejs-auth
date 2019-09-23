const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

dotenv.config();

mongoose.connect(
  process.env.ATLAS_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log('connected to mongoDB...')
);



app.use(express.json());
app.use('/api/users', authRoute);
app.use('/api/posts', postRoute);


app.listen(5000, () => console.log('Server is running on port 5000...'));