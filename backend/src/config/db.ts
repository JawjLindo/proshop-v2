import mongoose from 'mongoose';

export const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI!);
    console.info(`MongoDB Connection: ${conn.connection.host}`.cyan.underline);
  } catch (error: any) {
    console.error(`Error: ${(error as Error).message}`.red.underline.bold);
    process.exit(1);
  }
};
