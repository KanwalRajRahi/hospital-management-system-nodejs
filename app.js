const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const flash = require('connect-flash');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));

// EJS setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout'); // This tells Express to use views/layout.ejs as the default layout
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);

// Session and Flash setup
app.use(session({
    secret: 'hospital-management-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));
app.use(flash());

// Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/doctors', require('./routes/doctors'));
app.use('/patients', require('./routes/patients'));
app.use('/appointments', require('./routes/appointments'));
app.use('/prescriptions', require('./routes/prescriptions'));

// Error handling
app.use((req, res, next) => {
    res.status(404).render('error', {
        message: 'Page not found',
        error: { status: 404 }
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).render('error', {
        message: err.message || 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;