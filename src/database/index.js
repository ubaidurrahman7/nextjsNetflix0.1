import mongoose from "mongoose";

const connectToDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://ubaidurr888999:ubaid123@cluster0.4anxjsd.mongodb.net/netflix-clone"
    );
    console.log("mongodb is connected successfully", connectToDB);
  } catch (e) {
    console.log(e);
  }
};

export default connectToDB;
