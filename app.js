const express = require('express')
const app = express();
const mongoose = require('mongoose');
const router = require('./routes/user-routes');
const blogRouter = require('./routes/blog-routes');

// for recieving json data from postman
app.use(express.json()); // parse all data in JSON format

// use middleware to use routes
app.use("/api/user", router)// http://localhost:8000/api/user
app.use("/api/blog", blogRouter)// http://localhost:8000/api/blog

// app.use("/api", (req, res, next) => {
//     res.send("Hello there Aadi");
// })


//DB connection with port listening
mongoose.connect('mongodb+srv://admin:Cfx7WhWNVNRFUrGF@cluster0.9zelkvn.mongodb.net/Blog?retryWrites=true&w=majority')
.then(() => app.listen(8000))
.then(() => console.log("Connected to DB and listening to port 8000"))
.catch((err) => console.log(err));