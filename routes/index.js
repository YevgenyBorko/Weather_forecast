/* libraries imports */
let express = require('express');
let router = express.Router();
let Cookies = require('cookies')

const db = require('../models'); //contain the Contact model, which is accessible via db.Contact

/* GET to home page. */
router.get('/', function(req, res, next) {
    if (req.session.gotConnection)
        res.redirect("weather");
  res.render('register', { title: 'Registration page' });
});

/* GET to login page. */
router.get('/login', function(req, res, next) {
    res.render('login', { title: 'New login' });
});

/* GET to weather page. */
router.get('/weather', function(req, res, next) {
    if (req.session.gotConnection)
        return res.render('weather', { title: 'Weather page' , firstName: req.session.firstName});
    return res.render('login', { title: 'New login' });
});

/* logout from weather page to login page. */
router.post('/logout', function(req, res, next) {
    req.session.gotConnection = false
    res.render('login', { title: 'New login' });
});

/* logout from weather page to login page. */
router.get('/logout', function(req, res, next) {
    res.render('login', { title: 'New login' });
});

/* open session when user logged in */
router.post('/login', function(req, res, next) {
    return db.Contact.findOne({ where:{email:req.body.email, password: req.body.password }})
        .then((users) => {
            if(users != null) {
                req.session.gotConnection = true            // if session started
                req.session.firstName = users.firstName     // pass firstname variable from user to session
                req.session.email = req.body.email          // pass email variable from user to session
                return res.redirect("weather");
            }
          return db.Contact.findOne({ where:{email:req.body.email}})
                  .then((users) => {
                      if(users != null) {
                          res.render('login', { title: 'Password incorrect' });
                      }
            else {
                res.render('login', {title: 'User not found'});
            }
            })
            .catch(() => {
                res.render("login", {title:'Login Page'});
            });
        })
        .catch(() => {
            res.render("login", {title:'Login Page'});
        });
});

/* set cookies and session when registered */
router.post('/register', function(req, res, next) {
  return db.Contact.findOne({ where:{email:req.body.email }})
      .then((users) => {
        if(users != null) {
          res.render("register", {title:'This email is already in use, please choose another one.'});
        }
        else{
            let cookies = new Cookies(req, res)                 // set cookie timeout
            cookies.set ('LastVisit', new Date().toISOString(),
                { maxAge:  60000 })

            req.session.email = req.body.email              // move session email from html to session
            req.session.firstName = req.body.firstName      // move session firstName from html to session
            req.session.lastName = req.body.lastName        // move session lastName from html to session

          res.render('password', {          // move to password page, send parameters from login page to password page
              title: 'Password page',
              email: req.session.email,
              firstName: req.session.firstName,
              lastName: req.session.lastName
          });
        }
      })
      .catch(() => {
          res.render("register", {title:'Register Page'});
      });
});

/*render window login after registration*/
router.get('/register', function(req, res, next) {
    res.render('login', { title: 'New login' });
});

/* add user to database and if already exists redirect to logout*/
router.get('/WeatherList', function(req, res, next) {
    return db.Weather.findAll({ where:{email:req.session.email}})
        .then((Weather) => res.send(Weather))
        .catch(() => {
            res.redirect("logout");
        });
});

/* go to login window when wrong url is given */
router.get('*', function(req, res) {
    res.render('login', { title: 'Bad URL' });
});


module.exports = router;  // export model to other routes
