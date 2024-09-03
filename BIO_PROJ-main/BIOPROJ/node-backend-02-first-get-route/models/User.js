const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
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
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    required: true, 
    enum: ['user', 'admin', 'student', 'pending'], 
    default: 'pending'
  },
  isApproved: { 
    type: Boolean, 
    default: false 
  }
});

module.exports = mongoose.model('User', userSchema);