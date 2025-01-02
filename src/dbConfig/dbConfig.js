import mongoose from "mongoose";

export const dbConnect = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://vibhorsharma969:Vibhu2006@personalportfoliogen.fryp3.mongodb.net/"
    );
    console.log("Connected to the database");
  } catch (error) {
    console.log(error);
  }
};
