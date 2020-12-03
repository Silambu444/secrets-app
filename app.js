const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require("mongoose");

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect("mongodb+srv://sim:admin@cluster0.kv3hh.mongodb.net/userDB?retryWrites=true&w=majority");

const userSchema = {
    email : String,
    password : String
}

const User = new mongoose.model("User", userSchema);

app.route("/")
.get(function(req, res){
    res.render("home");
});

app.route("/login")
.get(function(req, res){
    res.render("login");
})
.post(function(req, res){
    const username = req.body.username
    const password = req.body.password

    User.findOne({email: username}, function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            if(foundUser.password === password){
                res.render("secrets");
            } else {
                console.log("password incorrect");
                res.send("password incorrect");
            }
        }
    })
});

app.route("/register")
.get(function(req, res){
    res.render("register");
})
.post(function(req, res){
  
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })
    newUser.save(function(err){
        if(err){
            console.log(err);
        } else {
            res.render("secrets");
        }
    });
})

app.listen(3000, function(){
    console.log("server running on port 3000");
});