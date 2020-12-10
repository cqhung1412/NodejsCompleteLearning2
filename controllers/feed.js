exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        title: '1st Post',
        content: 'This is the first post!!!'
      }
    ]
  });
};