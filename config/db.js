const mongoose = require('mongoose');

// Add connection pooling options
const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb+srv://databasepractice:QNYPFBwKhkDNxBlS@mongodbpractice.5im5gmq.mongodb.net/mongoDB_Practice?retryWrites=true&w=majority&appName=MongodbPractice', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // Remove deprecated poolSize option
            socketTimeoutMS: 45000, // Increase socket timeout
            connectTimeoutMS: 30000, // Increase connection timeout
            // Use the new connection pool settings
            maxPoolSize: 10,
            minPoolSize: 5
        });
        
        console.log(`MongoDB connected successfully`);
        return conn;
    } catch (err) {
        console.error(`Error connecting to MongoDB: ${err.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;