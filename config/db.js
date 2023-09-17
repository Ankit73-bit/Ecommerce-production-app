import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connect(process.env.DATABASE);
    console.log("MongoDB connection successful.");
  } catch (err) {
    console.log(`Error in mongoDB: ${err}`);
  }
};

export default connectDB;
