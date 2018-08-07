const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const http = require('http');
const passport = require('passport');
const mongoose = require('mongoose');
const Poet = require('poet');

const routes = require('./routes/routes');
const secureRoutes = require('./routes/secure-routes');
const postRoutes = require('./posts/posts');

mongoose.connect('mongodb://127.0.0.1:27017/awesome-blog-db');
mongoose.connection.on('error', error => console.log(error));
mongoose.Promise = global.Promise;

require('./auth/auth');

const app = express();

// Poet.js initialization ================================

const poet = Poet(app, {
  posts: './_posts/',
  metaFormat: 'json'
});
poet.options.readMoreLink = function (post) {
  return '';
};

poet
  .addRoute('/api/post/:post', (req, res, next) => {
    const post = poet.helpers.getPost(req.params.post);
    if (post) {
      res.json({ post });
    } else {
      res.sendStatus(404);
    }
  })
  .addRoute('/api/posts', (req, res, next) => {
    res.json({ 'posts': poet.helpers.getPosts() })
  })
  .init().then(() => {

  });

//=======================================================

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, '../dist')));

app.use('/', routes);
app.use('/', secureRoutes);
app.use('/', postRoutes);

app.use('/user', passport.authenticate('jwt', { session: false }), secureRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`API is running on localhost:${port}`));
