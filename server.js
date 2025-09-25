require('dotenv').config();
const express = require('express');
const connectToDB = require('./database/db.js');
const authRoutes = require('./routes/auth-routes.js');
const homeRoutes = require('./routes/home-routes.js');
const adminRoutes = require('./routes/admin-routes.js');
const uploadImageRoutes = require('./routes/image-routes.js');
connectToDB();

const app = express();
const PORT = process.env.PORT || 3000;

//middlewares
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/image', uploadImageRoutes);

app.listen(PORT,() => {
  console.log(`server is now listening to port ${PORT}`);
})