import mongoose from "mongoose";

const connectdb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Database is connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection failed: ${error}`);
    process.exit(1);
  }
};

export default connectdb;
