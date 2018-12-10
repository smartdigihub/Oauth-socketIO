const express = require('express');
const cookieSession = require('cookie-session');
const passport = require('passport');
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
const passportSetup = require('./config/passport-setup');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const http = require('http');
const ServerIO = require('socket.io');

const app = express();

const port = process.env.PORT || 3000;

const server = http.createServer(app).listen(port);

const io = ServerIO.listen(server);


// set view engine
app.set('view engine', 'ejs');

app.use('/public', express.static('public'));

// set up session cookies
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());


// connect to mongodb
mongoose.connect(keys.mongodb.dbURI, { useMongoClient: true }, () => {
    console.log('Application is now connected to MongoDB database');
});

// set up routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes(io));

// create home route
app.get('/', (req, res) => {
    res.render('home', { user: req.user });
});

// var server = app.listen(port, () => {
//     console.log(`Application now listening for requests on port ${port}`);
// });

module.exports = app;




