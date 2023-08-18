const User = require('../model/User');
const bcrypt = require('bcryptjs'); // for hashing password

// getting all user in function getAllUser from model(or DB)
const getAllUser = async(req, res, next) => {
    let users;
    try {
        users = await User.find();
    } catch(err) {
        console.log(err);
    }

    // validation
    if(!users) {
        return res.status(404).json({ message: "No Users Found" })
    }

    //if everything is fine, then return below statement
    return res.status(200).json({ users });
}

// post request and save in DB for signup
const signup = async (req, res, next) => {
    //destructuring data
    const { name, email, password } = req.body;
    console.log(req.body);

    // validation
    let existingUser;
    try {
        existingUser = await User.findOne({ email });
    } catch(err) {
        return console.log(err);
    }

    if(existingUser) {
        return res.status(400).json({ message: "User Already Exists! Login Instead" })
    }

    // hashing the password
    const hashedPassword = bcrypt.hashSync(password);

    //if existing user not found then create new user below
    const user = new User({
        name,
        email,
        password: hashedPassword,
        blogs: []   // to connect each other
    });

    // to save new user 
    try {
        await user.save();  // saved in database
    } catch(err) {
        return console.log(err);
    }

    return res.status(201).json({ user })
}

// post request and save in DB for login
const login = async (req, res, next) => {
    const { email, password } = req.body;
    console.log(req.body);

    // validation
    let existingUser;
    try {
        existingUser = await User.findOne({ email });
    } catch(err) {
        return console.log(err);
    }

    // is user not found
    if(!existingUser) {
        return res.status(404).json({ message: "Couldn't Find User By This Email" });
    }

    // if user found, compare password
    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
    if(!isPasswordCorrect) {
        return res.status(400).json({ message: "Incorrect Password" });
    }
    // if password correct
    return res.status(200).json({ message: "Login Successful" });
}   

module.exports = { getAllUser, signup, login };