const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require("jsonwebtoken");

const User = require('../models/user');
const Post = require('../models/post');

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
  },
  login: async function ({ email, password }) {
    const user = await User.findOne({ email })
    if (!user) {
      const error = new Error('User not found!')
      error.code = 401
      throw error
    }
    const isEqual = bcrypt.compare(password, user.password)
    if (!isEqual) {
      const error = new Error('Password is incorrect!')
      error.code = 401
      throw error
    }
    const token = jwt.sign({
      userId: user._id.toString(),
      email: user.email
    }, 'asupersecret', { expiresIn: '1h' })
    return { token, userId: user._id.toString() }
  },
  createPost: async function ({ postInput, token }, req) {
    console.log(postInput)
    const tokenContent = jwt.decode(token)
    const user = await User.findById(tokenContent.userId)
    if (!user) {
      const error = new Error('Unauthorized!')
      error.code = 401
      throw error
    }
    const post = await Post.create({
      ...postInput,
      creator: user._id
    })
    if (!post) {
      const error = new Error('Unable to create post!')
      error.code = 500
      throw error
    }
    await User.updateOne({ _id: user._id }, { "$push": { "posts": post._id } })
    const result = await Post.findById(post._id).populate("creator");
    console.log(result)
    return result
  }
};