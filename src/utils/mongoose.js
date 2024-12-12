import mongoose from "mongoose";

const connectDB = (handler) => async (req, res) => {
  mongoose.set("strictQuery", true);
  if (mongoose.connections[0].readyState) {
    return handler(req, res);
  }

  try {
    await mongoose.connect('mongodb+srv://aswinkrishna363:V26gleWsZXzYcHfq@cluster0.vvzw4.mongodb.net/');
    return handler(req, res);
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ error: "Database connection failed" });
  }
};


export default connectDB;
