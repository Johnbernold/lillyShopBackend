require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const adminRoutes = require('./routes/adminRoutes');
const userDashboardRoutes = require('./routes/userDashboardRoutes');

const app = express();
const PORT = process.env.PORT || 3600;

// === CORS Configuration ===
const corsOptions = {
  origin: '*', // Change this to your frontend domain in production
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
};

// const corsOptions = {
//     origin: ['http://your-frontend.com', 'https://another-site.com'],
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     allowedHeaders: 'Content-Type,Authorization',
//     credentials: true // Allow cookies if needed
// };

app.use(cors(corsOptions));

// === Body Parser Middleware ===
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// === Swagger (only in development) ===
if (process.env.NODE_ENV !== 'production') {
  const setupSwagger = require('./swagger');
  setupSwagger(app);
}

// === Routes ===
app.use('/admin', adminRoutes);
app.use('/user', userDashboardRoutes);

// === Default Route ===
app.get('/', (req, res) => {
  res.send('Server is running...');
});

// === Start Server ===
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
