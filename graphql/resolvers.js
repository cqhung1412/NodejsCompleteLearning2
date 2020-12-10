const bcrypt = require('bcryptjs');

const User = require('../models/user');

module.exports = {
  createUser: async function(args, req) {
    const { email, name, password } = args.userInput;
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