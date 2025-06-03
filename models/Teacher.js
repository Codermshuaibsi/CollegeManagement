const mongoose = require('mongoose');

const teacherSchema  = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    default: "Teacher"
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HOD"
  },
  salaryPaid: {
    type: Number,
    default: 0
  },
  subjects: [{
    type: String
  }],
  department: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  totalSalary: {
    type: Number,
    default: 0
  },
  dueSalary: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Teacher', teacherSchema );
