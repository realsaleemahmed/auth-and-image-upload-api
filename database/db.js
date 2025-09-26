const mongoose = require('mongoose');

const connectToDB = async () => {
  try{
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected succesfully');
  } catch(e) {
    console.log('mongoDB connection Failed', e.message);
    process.exit(1);
  }
}

module.exports = connectToDB;