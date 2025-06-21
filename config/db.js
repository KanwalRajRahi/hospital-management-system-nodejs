const mongoose = require('mongoose');

// Add connection pooling options
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // Remove deprecated poolSize option
            socketTimeoutMS: parseInt(process.env.DB_SOCKET_TIMEOUT_MS) || 45000, // Increase socket timeout
            connectTimeoutMS: parseInt(process.env.DB_CONNECT_TIMEOUT_MS) || 30000, // Increase connection timeout
            // Use the new connection pool settings
            maxPoolSize: parseInt(process.env.DB_MAX_POOL_SIZE) || 10,
            minPoolSize: parseInt(process.env.DB_MIN_POOL_SIZE) || 5
        });
        
        console.log(`MongoDB connected successfully`);
        return conn;
    } catch (err) {
        console.error(`Error connecting to MongoDB: ${err.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;