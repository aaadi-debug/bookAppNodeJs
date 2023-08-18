const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// collection
const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: 6
    },
    // to relate with blogs
    blogs: [{
        type: mongoose.Types.ObjectId,
        ref: "Blog",
        required: true
    }]
});

// export collection in MongoDB
// name of collection - User
const User = new mongoose.model("User", userSchema);

module.exports = User;
