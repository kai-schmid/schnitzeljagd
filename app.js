#!/usr/bin/env node
const express = require('express'); // server software
const bodyParser = require('body-parser'); // parser middleware
const session = require('express-session');  // session middleware
const passport = require('passport');  // authentication
const connectEnsureLogin = require('connect-ensure-login');// authorization

// Database
const User = require('./express/user'); // User Model
const Dataset = require('./express/dataset'); // Dataset Model
const Position = require('./express/position'); // Position Model

const app = express();

app.set('view engine', 'ejs');

// Configure Sessions Middleware
app.use(session({
  secret: 'r8q,+&1LM3)CD*zAGpx1xm{NeQhc;#',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));

app.use(express.json({
  type: ['application/json', 'text/plain']
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

  Dataset.find({ user: req.user._id }, { name: 1, user: 1, _id: 1 }).then((dataset) => {
    var jsonData = [];
    if (dataset.length > 0) {
      jsonData = dataset;
    }
    else {
      jsonData = [];
    }
    const jsonDataString = JSON.stringify(jsonData);
    res.render(__dirname + '/html/dashboard', { user: req.user.username, session: req.session, sessionID: req.sessionID, jsonData: jsonDataString });
  }).catch((err) => {
    console.log(err);
    const jsonDataString = "[]";
    res.render(__dirname + '/html/dashboard', { user: req.user.username, session: req.session, sessionID: req.sessionID, jsonData: jsonDataString });
  });
});

app.get('/js/dashboard.js', (req, res) => {
  res.sendFile(__dirname + '/js/dashboard.js');
});
app.get('/style/dashboard.css', (req, res) => {
  res.sendFile(__dirname + '/style/dashboard.css');
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
  console.log(req.body);
  User.register({ username: req.body.username, active: false }, req.body.password.toString()).then((user) => {
    res.redirect('/login');
  }).catch((err) => {
    console.log(err);
    return res.redirect('/register');
  });
});
app.get('/html/editJson', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  Dataset.findById(req.query.id).then((dataset) => {
    if (dataset != null) {
      jsonData = {
        name: dataset.name,
        userId: dataset.user,
        _id: dataset._id,
        jsonArray: dataset.jsonArray
      };
      // Die JSON-Daten als Zeichenfolge in das HTML-Dokument einfügen
      const jsonDataString = JSON.stringify(jsonData);
      // Die render-Methode übergibt die Zeichenfolge an die HTML-Seite
      res.render(__dirname + '/html/editJson', { jsonData: jsonDataString });
    } else {
      res.redirect('/dashboard');
    }
  }).catch((err) => {
    console.log(err);
    res.redirect('/dashboard');
  });
});

app.get('/api/newDataset', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  const dataset = new Dataset({
    name: req.query.name,
    jsonArray: [],
    user: req.user._id,
  });
  const jsonData = {
    name: dataset.name,
    userId: dataset.user,
    _id: dataset._id,
    jsonArray: dataset.jsonArray
  };
  const position = new Position({
    datasetId: dataset._id,
    position: 0
  });
  dataset.save().then((dataset) => {
    position.save().then((position) => { }).catch((err) => { }).finally(() => {
      res.redirect('/html/editJson?id=' + dataset._id);
      //res.render(__dirname + '/html/editJson', { jsonData: JSON.stringify(jsonData) });
    });

  }).catch((err) => {
    console.log("New Datset error: " + err);
    res.redirect('/dashboard');
  });
});

app.post('/api/saveDataset', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  console.log(req.body);
  const dataset = req.body;
  Dataset.updateOne({ _id: dataset._id }, { $set: { name: dataset.name, jsonArray: dataset.jsonArray } }).then((result) => {
    res.sendStatus(200);
  }).catch((err) => {
    console.log(err);
    res.sendStatus(500);
  });
});

app.delete('/api/deleteDataset', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  const dataset = req.body;
  Dataset.deleteOne({ _id: dataset.id }).then((result) => {
    res.sendStatus(200);
  }).catch((err) => {
    console.log(err);
    res.sendStatus(500);
  });
});

app.get('/js/editJson.js', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  res.sendFile(__dirname + '/js/editJson.js');
});
app.get('/style/editJson.css', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  res.sendFile(__dirname + '/style/editJson.css');
});

app.get('/style/index.css', (req, res) => {
  res.sendFile(__dirname + '/style/index.css');
});

app.get('/api/answer', (req, res) => {
  Dataset.findById(req.query.id).then((dataset) => {
    Position.findOne({ datasetId: dataset._id }).then((position) => {
      let rightAnswer = false;
      if (position != null) {
        dataset.jsonArray.forEach(element => {
          if (element.answer.toLocaleLowerCase().replace(/\s+/g, "") = req.query.answer.toLocaleLowerCase().replace(/\s+/g, "")) {
            rightAnswer = true;
          }
        });
        if (rightAnswer) {
          Position.updateOne({ datasetId: dataset._id }, { $inc: { position: 1 } }).then((result) => {
            const element = dataset.jsonArray[position.position + 1];
            const jsonData = {
              question: element.question,
              coordinates: element.coordinates,
              radiusMeters: element.radiusMeters,
              type: element.answerType
            };
            res.json(jsonData);
          }).catch((err) => {
            console.log(err);
            res.sendStatus(500);
          });

        }
        res.sendStatus(406);
      } else {
        res.sendStatus(500);
      }
    }
    ).catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
  });
});

app.get('/play', (req, res) => {
  Dataset.findById(req.query.id).then((dataset) => {
    if (dataset != null) {
      Position.findOne({ datasetId: dataset._id }).then((position) => {
        if (position != null) {
          const element = dataset.jsonArray[position.position];
          const jsonData = {
            question: element.question,
            coordinates: element.coordinates,
            radiusMeters: element.radiusMeters,
            type: element.answerType
          };
          const jsonDataString = JSON.stringify(jsonData);
          res.render(__dirname + '/html/suche', { jsonData: jsonDataString });
        } else {
          const position = new Position({
            datasetId: dataset._id,
            position: 0
          });
          position.save().then((position) => {
            const jsonData = dataset.jsonArray[position.position];
            const jsonDataString = JSON.stringify(jsonData);
            res.render(__dirname + '/html/suche', { jsonData: jsonDataString });
          }).catch((err) => {
            console.log(err);
            res.redirect('/dashboard');
          });
        }
      }).catch((err) => { });
    } else {
      res.send("Dataset not found");
    }
  }).catch((err) => {
    console.log(err);
    res.redirect('/dashboard');
  });
});
app.get('/js/suche.js', (req, res) => {
  res.sendFile(__dirname + '/js/suche.js');
});
app.get('/style/play.css', (req, res) => {
  res.sendFile(__dirname + '/style/suche.css');
});

// assign port
const port = 3000;
app.listen(port, () => console.log(`This app is listening on port ${port}`));
