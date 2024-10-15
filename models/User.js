const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    username:{tye:String, required:true, unique:true},
    fullName:{tye:String, required:true},
    role:{type:String, enum:['customer', 'admin'],required:true},
    accountNumber:{type:Number,required:true,unique:true},
    balance:{type:Number, default:0},
    isActive:{type:Boolean, default:true},
    accounts:[{         // ? different type of investment accounts the user hold.
        accountId:{type:Number,required:true,unique:true},
        accountType:{type:String}, 
        balance:{type:Number},
        interestRate:{type:Number},
        maturityDate:{type:Date}
    }]
},{timestamps:true})

// * hashing the password before creating the user document inside the database.
UserSchema.pre('save',async (next) => {
    if(!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)
    next()
})

module.exports = mongoose.model('User', UserSchema)