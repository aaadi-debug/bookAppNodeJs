const { default: mongoose } = require('mongoose');
const Blog = require('../model/Blog');
const User = require('../model/User');

const getAllBlogs = async (req, res, next) => {
    let blogs;
    try {
        blogs = await Blog.find();
    } catch(err) {
        return console.log(err);
    }

    // validation
    if(!blogs) {
        return res.status(404).json({ message: "No BLogs Found" })
    }
    // if blog found
    return res.status(200).json({ blogs })
}

const addBlog = async (req, res, next) => {
    //destructuring data
    const { title, description, image, user } = req.body;
    console.log(req.body);

    // to connect each other
    let existingUser;
    try {
        existingUser = await User.findById(user);
    } catch(err) {
        return console.log(err);
    }

    if(!existingUser) {
        return res.status(400).json({ messgae: "Unable to Find User by This ID" })
    }

    const blog = new Blog({
        title,
        description,
        image,
        user
    });

    try {
        // await blog.save(); // saved in DB

        // to connect each other
        const session = await mongoose.startSession();
        session.startTransaction();
        await blog.save({ session });
        existingUser.blogs.push(blog);
        await existingUser.save({ session });
        await session.commitTransaction();

    } catch(err) {
        console.log(err);
        return res.status(500).json({ messgae: err })
    }

    return res.status(200).json({ blog });
}

const updateBlog = async (req, res, next) => {
    const { title, description } = req.body;
    const blogId = req.params.id;  // id from MongoBD
    
    let blog;
    try {
        // updating id with help of title & description
        blog = await Blog.findByIdAndUpdate(blogId, {
            title,
            description
        })
    } catch(err) {
        return console.log(err);
    }

    if(!blog) {
        return res.status(500).json({ message: "Unable To Update Blog" })
    }
    return res.status(200).json({ blog })
}

const getById = async (req, res, next) => {
    const id = req.params.id;

    let blog;
    try {
        // will return blog just by id
        blog = await Blog.findById(id); 
    } catch(err) {
        return console.log(err);
    }

    if(!blog) {
        return res.status(404).json({ message: "No Blog Found" })
    }
    // if blog found
    return res.status(200).json({ blog });
}

const deleteBlog = async (req, res, next) => {
    const id = req.params.id;

    let blog;
    try {
        blog = await Blog.findByIdAndRemove(id).populate('user');
        await blog.user.blogs.pull(blog);
        await blog.user.save();

    } catch(err) {
        return console.log(err);
    }

    if(!blog) {
        return res.status(500).json({ message: "Unable to Delete" })
    }
    // if everything fine
    return res.status(200).json({ message: "Successfully Deleted" })
}


const getByUserId = async (req, res, next) => {
    const userId = req.params.id;
    let userBlogs;
    try {
        userBlogs = await User.findById(userId).populate("blogs");
    } catch(err) {
        return console.log(err);
    }

    if(!userBlogs) {
        return res.status(404).json({ message: "no Blog Found" })
    }
    return res.status(200).json({ blogs: userBlogs })
}


module.exports = { getAllBlogs, addBlog, updateBlog, getById, deleteBlog, getByUserId };