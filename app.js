require('dotenv').config()
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose")
var encrypt = require('mongoose-encryption');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs');
app.use(express.static("public"))
mongoose.connect("mongodb://localhost:27017/userDB")

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})


userSchema.plugin(encrypt, { secret: process.env.SECRET , encryptedFields: ['password']  });


const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render("home")
})

app.get("/register", (req, res) => {
    res.render("register")
})

app.post("/register", async (req, res) => {
    try {
        const newUser = new User({
            email: req.body.username,
            password: req.body.password
        })
        newUser.save();
        res.render("secrets")
    } catch (error) {
        console.log(error)
    }

})

app.get("/login", (req, res) => {
    res.render("login")
})

app.post("/login", async(req,res) => {


     try {

     const userName = req.body.username;
     const password = req.body.password;

        const foundUser =  await User.findOne({ email: userName })
        console.log(foundUser)
        if (foundUser) {
            if (foundUser.password === password) {
                res.render("secrets")
            }
        }

    } catch (error) {
        console.log(error)
    }


})


app.listen("3000", (req, res) => {
    console.log("Server is Started on Port 3000")
})
