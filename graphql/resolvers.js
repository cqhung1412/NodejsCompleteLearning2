const bcrypt = require('bcryptjs');
const validator = require('validator');

const User = require('../models/user');

module.exports = {
  createUser: async function (args, req) {
    const { email, name, password } = args.userInput;
    
    let errors = [];
    if (!validator.isEmail(email)) {
      errors.push({ message: 'Email is invalid D:' });
    }
    if (validator.isEmpty(password) || !validator.isLength(password, { min: 6 })) {
      errors.push({ message: 'Password too short D:' });
    }
    if (errors.length > 0) {
      const error = new Error('Invalid inputs D:');
      error.data = errors;
      error.code = 422;
      throw error;
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      throw new Error('User has already existed!');
    }
    const hashedPwd = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      name,
      password: hashedPwd
    });
    const createdUser = await user.save();
    return { ...createdUser._doc, _id: createdUser._id.toString() };
  }
};