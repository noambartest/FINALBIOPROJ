const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const dateSchema = new Schema({
  day: {
    type: Number,
    required: true,
  },
  month: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
});

const donateSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  btype: {
    type: String,
    required: true,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  },
  address: {
    type: String,
    required: true,
  },
  donatorID: {
    type: String,
    required: true,
  },
  birthDate: {
    type: dateSchema,
    required: true,
  },
  donateDate: {
    type: dateSchema,
    required: true,
  },
  mentalHealthCondition: {
    type: String,
    required: true,
  },
  careProvided: {
    type: String,
    required: true,
  },
  creditCard: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Donate", donateSchema);