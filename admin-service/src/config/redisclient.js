const redis = require('redis');

// Create a Redis client instance
let client;

//redis client configuration
const getRedisClient = () => {
    if (!client) {
        client = redis.createClient({
            url: process.env.REDIS_URL || 'redis://localhost:6380',
        });

        // Handle connection errors
        client.on('error', (err) => {
            console.error('Redis Client Error', err);
        });

        // Connect the client
        client.connect().catch(console.error);
    }
    return client;
};

module.exports = { getRedisClient };
