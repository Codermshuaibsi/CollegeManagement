const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  fatherName: String,
  motherName: String,
  course: String,
  age: Number,
  city: String,
  state: String,
  totalCourseFee: Number,
  depositedFee: Number,
  dueFee: Number,
  role: {
    type: String,
    default: "Student"
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher"
  },
});

module.exports = mongoose.model("Student", studentSchema);
