import mongoose from 'mongoose';
import { setServers } from 'node:dns/promises';

setServers(['1.1.1.1', '8.8.8.8']);

export const connectDB = async (uri: string): Promise<void> => {
  try {
    const connection = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};
