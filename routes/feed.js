const express = require('express');

const feedController = require('../controllers/feed');

const Router = express.Router();

// GET /feed/posts
Router.get('/posts', feedController.getPosts);

module.exports = Router;