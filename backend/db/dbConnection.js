import mongoose from "mongoose";

const connectToDatabase = async () => {
  try {
    await mongoose.connect(`mongodb://localhost:27017/y`);
    console.log("Connected to database 'y'");
  } catch (err) {
    console.error(err);
  }
};

export { connectToDatabase };
