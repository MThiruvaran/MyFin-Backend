const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },     
  message: { type: String, required: true },                                          
  sender: { type: String, enum: ['customer', 'admin'], required: true },              
}, { timestamps: true });

module.exports = mongoose.model('Chat', ChatSchema);
