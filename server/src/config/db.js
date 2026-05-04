import mongoose from "mongoose";

export async function connectDb() {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/codetrack";
  await mongoose.connect(uri);
   
  console.log("Mongo connected");
}

