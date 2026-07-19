const dns = require('dns');
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME || 'desoc-genesis',
    });
    console.log('MongoDB connected');
  } catch (err) {
    // If it's a DNS resolution error (common on some networks/routers with MongoDB SRV),
    // fall back to public DNS resolvers and retry the connection.
    if (err.message.includes('querySrv') || err.code === 'ECONNREFUSED' || err.message.includes('ENOTFOUND')) {
      console.warn('DNS resolution failed. Retrying with Google/Cloudflare public DNS...');
      try {
        dns.setServers(['8.8.8.8', '1.1.1.1']);
        await mongoose.connect(process.env.MONGODB_URI, {
          dbName: process.env.DB_NAME || 'desoc-genesis',
        });
        console.log('MongoDB connected (via fallback public DNS)');
        return;
      } catch (retryErr) {
        console.error('MongoDB connection retry failed:', retryErr.message);
        process.exit(1);
      }
    }
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;