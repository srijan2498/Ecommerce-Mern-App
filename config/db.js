const mongoose = require("mongoose");
const colors = require("colors");

const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL);
    } catch (error) {
    }
}

module.exports = connectDb;