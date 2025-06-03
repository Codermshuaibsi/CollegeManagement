const mongoose = require('mongoose');

const directorSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: {
        type: String,
        default: "Director"
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chairman"
    },
})
module.exports = mongoose.model('Director', directorSchema);