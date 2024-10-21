require('dotenv').config()
const express = require("express")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const {accountNumberGenerator} = require('../utilities/utils')
const salt = bcrypt.genSaltSync(10)

const User = require('../models/User')
const Accounts = require('../models/Accounts')

const router = express.Router()

router.post('/register',async(req,res)=>{
    console.log(req.body)
    const {email,fullname,role,password}=req.body
    try{
        let user = await User.findOne({email})
        if(user) return res.status(400).json({message:"User already exists"});
        const accountNumber = accountNumberGenerator()
        user = new User({email,role,password:bcrypt.hashSync(password,salt)})
        await user.save()
        let account = new Accounts({email, fullname, accountNumber})
        await account.save()
        res.status(201).json({message:"User registered successfully"})
    } catch (error){
        console.log("error in /register: ",error)
        res.status(500).json({message:error.message})
    }

})

router.post('/login',async(req,res) =>{
    const {email,password} = req.body
    try{
        const user = await User.findOne({email})
        if(!user) return res.status(400).json({message:'Invalid credentials'})

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) return res.status(400).json({message:'Invalid credentials'})
        
        const token = jwt.sign({email:user.email, role:user.role}, process.env.SECRET_KEY_JWT, {expiresIn:'1h'})
        res.status(200).json({token})
    } catch (error) {
        console.log('error in /login: ',error)
        res.status(500).json({message:error.message})
    }
})

module.exports = router