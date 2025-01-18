const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contactNumber: { type: String, required: true },
  password: { type: String, required: true },
  otp: { type: String },
  isVerified: { type: Boolean, default: false }
});

//? Secure the password with the bcrypt
userSchema.pre('save',async function(next){
  const currUser=this;
  if(!currUser.isModified('password')){
      next();
  }
  try {
      const saltRound=await bcrypt.genSalt(10);
      const hash_password=await bcrypt.hash(currUser.password,saltRound)
      currUser.password=hash_password;
  } catch (error) {
      next(error);
  }
})

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};
module.exports = mongoose.model('User', userSchema);
