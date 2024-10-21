const mongoose = require('mongoose')


const AccountSchema = new mongoose.Schema({
    email:{type:String, required: true, unique:true},
    fullname:{type:String, required:true},
    accountNumber:{type:String,required:true,unique:true},
    balance:{type:Number, default:0},
    isActive:{type:Boolean, default:true},
    accounts:[{         // ? different type of investment accounts the user hold.
        accountId:{type:String},
        accountType:{type:String}, 
        balance:{type:Number},
        interestRate:{type:Number},
        maturityDate:{type:Date}
    }]
})


module.exports = mongoose.model('Accounts',AccountSchema)