import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    // eslint-disable-next-line no-undef
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB Connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

export default connectMongoDB;
