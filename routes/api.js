let express = require('express');
let router = express.Router();
let Cookies = require('cookies')

const db = require('../models'); //contain the Contact model, which is accessible via db.Contact

router.post('/add', (req, res) => {

    let cookies = new Cookies(req, res);      // define a cookie
    let lastVisit = cookies.get('LastVisit');

    if(!lastVisit)
        res.render("register", {title: "Cookie removed/timeout"});

    return db.Contact.findOne({ where:{email:req.session.email }})
        .then((users) => {
            if (users != null) {
                res.render("register", {title: 'This email is already in use, please choose another one.'});
            }
            else{
                const {password} = req.body
                const {email, firstName, lastName} = req.session
                return db.Contact.create({email, firstName, lastName, password})
                    .then((contact) => res.render('login', {title: "you are registered"}))
            }
        })
        .catch((err) => {
            res.send("failed connect to server");
        });
});


router.post('/addWeather/:cityName/:latitude/:longitude', (req, res) => {
    if(req.session.gotConnection)
    {
        let cityName = req.params.cityName
        let latitude = req.params.latitude
        let longitude = req.params.longitude
        const { email } = req.session
        db.Weather.create({ email, cityName, latitude, longitude })
    }
    else
        return res.then(() => res.send())
            .catch(() => {
                res.redirect("logout");
            });
});


router.delete('/delete/:cityName/:latitude/:longitude', (req, res) => {
    db.Weather.destroy({
        where: { email:req.session.email,
                 cityName:req.params.cityName,
                 latitude:req.params.latitude,
                 longitude:req.params.longitude}})
});

router.delete('/reset', (req, res) => {
    db.Weather.destroy({
        where: { email:req.session.email}})
});


module.exports = router;