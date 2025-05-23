const mongoose = require("mongoose");
const { isEmail } = require("validator");

const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: [true, "This email already exists"],
    required: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Minimum legth for password is 6"],
  },
});

userSchema.pre("save", async function(next) {
  const salt = await bcrypt.genSalt()
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email })

  if(user) {
    const auth = await bcrypt.compare(password, user.password)
    if(auth) {
      return user 
    }
    throw Error("Incorrect password")
  }
  throw Error("Incorrect email")
}

const User = mongoose.model("user", userSchema);


module.exports = User;
