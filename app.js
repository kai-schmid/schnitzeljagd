const express = require('express'); // server software
const bodyParser = require('body-parser'); // parser middleware
const session = require('express-session');  // session middleware
const passport = require('passport');  // authentication
const connectEnsureLogin = require('connect-ensure-login');// authorization

const User = require('./express/user'); // User Model 

const app = express();

app.set('view engine', 'ejs');

// Configure Sessions Middleware
app.use(session({
  secret: 'r8q,+&1LM3)CD*zAGpx1xm{NeQhc;#',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));

// Configure Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

// Passport Local Strategy
passport.use(User.createStrategy());

// To use with sessions
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Route to Homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/html/index.html');
});

// Route to Login Page
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/html/login.html');
});

// Route to Dashboard
app.get('/dashboard', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  res.render(__dirname + '/html/dashboard', { user: req.user.username, session: req.session, sessionID: req.sessionID });
});

app.get('/js/dashboard.js', (req, res) => {
  res.sendFile(__dirname + '/js/dashboard.js');
});
app.get('/style/dashboard.css', (req, res) => {
  res.sendFile(__dirname + '/style/dashboard.css');
});

// Route to Secret Page
app.get('/secret', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  res.sendFile(__dirname + '/html/secret-page.html');
});

// Route to Log out
app.get('/logout', function (req, res) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
});

// Post Route: /login
app.post('/login', passport.authenticate('local', { failureRedirect: '/' }), function (req, res) {
  console.log(req.user)
  res.redirect('/dashboard');
});

app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/html/register.html');
});

app.post('/register', (req, res) => {
  User.register({ username: req.body.username, active: false }, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      return res.redirect('/register');
    }
    res.redirect('/login');
  });
});
app.get('/html/editJson', (req, res) => {
  var jsonData = {
    name: "test",
    userId: 123,
    id: null,
    jsonArray: [
      {
        "question": "test",
        "coordinates": {
          "latitude": 1,
          "longitude": 1
        },
        "answers": [
          "test"
        ],
        "answerType": "text"
      }
    ]
  }
  // Die JSON-Daten als Zeichenfolge in das HTML-Dokument einfügen
  const jsonDataString = JSON.stringify(jsonData);
  // Die render-Methode übergibt die Zeichenfolge an die HTML-Seite
  res.render(__dirname +'/html/editJson', { jsonData: jsonDataString });
});

app.get('/js/editJson.js', (req, res) => {
  res.sendFile(__dirname + '/js/editJson.js');
});
app.get('/style/editJson.css', (req, res) => {
  res.sendFile(__dirname + '/style/editJson.css');
});

// assign port
const port = 3000;
app.listen(port, () => console.log(`This app is listening on port ${port}`));
