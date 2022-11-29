//jshint esversion:6
require('dotenv').config();
const express = require('express');
const app=express();
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
const ejs=require('ejs');
app.set('view engine','ejs');

const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/userDB');

const encrypt=require("mongoose-encryption");


const userSchema=new mongoose.Schema({
    name:String,
    password:String
});

userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:["password"]});


const User=mongoose.model('User',userSchema);


app.get("/",function(req,res)
{
    res.render('home');
})

app.get("/login",function(req,res)
{
    res.render('login');
})
app.get("/register",function(req,res)
{
    res.render('register');
})


app.post("/login",function(req,res)
{
    const user1=req.body.username;
    const pass=req.body.password;
    User.findOne({username:user1},function(err,found)
    {
        if(!err)
        {
            if(found)
            {
            if(found.password===pass)
            {
                res.render("secrets");
            }
        }
            else
            console.log("Incorrect Password");
        }
        else
        console.log(err);
    })
})


app.post("/register",function(req,res)
{
    const newUser=new User({
        username:req.body.username,
        password:req.body.password
    })
    newUser.save(function(err)
    {
        if(!err)
        {
            res.render("secrets");
        }
        else
        {
            console.log(err);
        }
    })
})

app.listen(3000,function(req,res)
{
    console.log("Server running on port 3000");
})