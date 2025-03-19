const express = require('express');
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/adminRoutes');
const userDashboardRoutes = require('./routes/userDashboardRoutes');
const setupSwagger = require("./swagger"); // Import Swagger setup
const cors = require('cors');
const app = express();

//cross origin
const corsOptions = {
    origin: '*', // Allow all origins (change this in production)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
};



// Initialize Swagger
setupSwagger(app);


// const corsOptions = {
//     origin: ['http://your-frontend.com', 'https://another-site.com'],
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     allowedHeaders: 'Content-Type,Authorization',
//     credentials: true // Allow cookies if needed
// };

app.use(cors(corsOptions));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// User routes
app.use('/admin', adminRoutes);
app.use('/user', userDashboardRoutes);

const PORT = process.env.PORT || 3600;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});