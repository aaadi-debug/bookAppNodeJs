const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//collection
const blogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    user: {// which user has posted the blog
        
        //to relate blog and user
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    }
});

const Blog = new mongoose.model("Blog", blogSchema);

module.exports = Blog;