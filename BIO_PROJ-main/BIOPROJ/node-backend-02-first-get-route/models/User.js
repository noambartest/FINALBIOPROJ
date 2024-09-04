const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  birth_date: {
    day: { 
      type: String, 
      required: true 
    },
    month: { 
      type: String, 
      required: true 
    },
    year: { 
      type: String, 
      required: true 
    },
  },
  ID: { 
    type: String, 
    required: true, 
    unique: true 
  },
  role: { 
    type: String, 
    required: true, 
    enum: ['user', 'admin', 'student', 'donator', 'pending'], 
    default: 'pending'
  },
  isApproved: { 
    type: Boolean, 
    default: false 
  },
  aiFeatures: {
    age: { type: Number, default: null },
    sex: { type: Number, default: null },
    cp: { type: Number, default: null },
    trestbps: { type: Number, default: null },
    chol: { type: Number, default: null },
    fbs: { type: Number, default: null },
    restecg: { type: Number, default: null },
    thalach: { type: Number, default: null },
    exang: { type: Number, default: null }
  },
  aiResults: {
    prediction: { type: Number, default: null },
    message: { type: String, default: null }
  }
});

module.exports = mongoose.model('User', userSchema);