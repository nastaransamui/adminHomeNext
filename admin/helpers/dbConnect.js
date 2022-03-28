import mongoose from 'mongoose';
const { DATABASE_URL_UAT, DATABASE_URL_LIVE } = process.env;

if (process.env.NODE_ENV == 'development') {
  if (!DATABASE_URL_UAT) {
    new Error(
      'Please define the MONGODB_URI environment variable inside .env.local'
    );
  }
} else {
  if (!DATABASE_URL_LIVE) {
    new Error(
      'Please define the MONGODB_URI environment variable inside .env.local'
    );
  }
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  try {
    if (cached.conn) {
      return cached.conn;
    }
    if (!cached.promise) {
      const opts = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        keepAlive: true,
      };
      const connectionUrl =
        process.env.NODE_ENV == 'development'
          ? DATABASE_URL_UAT
          : DATABASE_URL_LIVE;
      cached.promise = mongoose
        .connect(connectionUrl, opts)
        .then((mongoose) => {
          return mongoose;
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

export default dbConnect;
