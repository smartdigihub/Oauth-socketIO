const router = require('express').Router();
const Chat = require('../models/Chat');

module.exports = (io) => {
  const authCheck = (req, res, next) => {
    if (!req.user) {
      res.redirect('/auth/login');
    } else {
      next();
    }
  };

  router.get('/', authCheck, (req, res) => {
    Chat.find({}).then(messages => {
      res.render('profile', { user: req.user, messages });
    }).catch(err => console.error(err));
  });

  // Chatroom
  var numUsers = 0;

  // Establish connection with client
  io.on('connection', socket => {
    var number = ++numUsers
    console.log(`${number} user(s) connected`);

    io.sockets.emit('user joined', {
      user: number
    });

    // Receive event emitted from client
    socket.on('chat', data => {
      //console.log(data)
      //create current time using Date method
      var date = new Date();
      Chat.createdAt = date.toLocaleTimeString();
      //console.log(Chat.createdAt);

      Chat.create({ name: data.handle, message: data.message, createdAt: Chat.createdAt }).then((result) => {
        //console.log(result);
        io.sockets.emit('chat', { name: result.name, message: result.message, createdAt: result.createdAt }); // return data
      }).catch(err => console.error(err));
    });

    socket.on('typing', data => {
      socket.broadcast.emit('typing', data); // return data
    });

    socket.on('disconnect', () => {
      var count = --numUsers;
      console.log(`${count} user(s) connected`);
      io.sockets.emit('user left', {
        user: count
      });
    });
  });

  return router;
}
