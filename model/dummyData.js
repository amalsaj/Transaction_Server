const mongoose = require("mongoose");

const dummmyData = new mongoose.Schema(
  {
    name: String,
    amount: Number,
  },
  { timestamps: true }
);

const Data = mongoose.model("data", dummmyData);

module.exports = Data;
