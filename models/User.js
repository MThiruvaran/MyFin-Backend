const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    email:{type:String, required: true, unique:true},
    password: { type: String, required: true },
    fullname:{type:String, required:true},
    role:{type:String, enum:['customer', 'admin'],required:true},
    accountNumber:{type:String,required:true,unique:true},
    balance:{type:Number, default:0},
    isActive:{type:Boolean, default:true},
    accounts:[{         // ? different type of investment accounts the user hold.
        accountId:{type:String,unique:true},
        accountType:{type:String}, 
        balance:{type:Number},
        interestRate:{type:Number},
        maturityDate:{type:Date}
    }]
})


module.exports = mongoose.model('User', UserSchema)