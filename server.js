const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes'); 

dotenv.config();
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors({
  origin: ["http://localhost:3000", "https://your-frontend-url.vercel.app"],
  credentials: true,
}));

// Mount route
app.use('/api/auth', authRoutes); 

// Simple test route
app.get('/', (req, res) => {
    res.send('API is working');
});

// Connect to DB and start server
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT , () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
})
.catch(err => console.error('DB connection error:', err));
