const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../config/auth');
const moment = require('moment');

require('../models/link');
const Link = mongoose.model('links');
//check ensureAuthenticated for?
router.get('/', ensureAuthenticated, (req, res) => {
    Link.find({user: req.user.id})
        .sort({date: 'desc'})
        .then(links => {
            res.send(links)
        })
    console.log(req.session.passport.user)
});


router.get('/add', (req, res) => {
    res.send('add links')
});

router.get('/edit:id', (req, res) => {
    res.send('edit links')
});

router.put('/:id', (req, res) => {
    res.send('update links')
});

router.post('/', (req, res) =>{
    let errors = [];
    if (!req.body.wordFind) {
        errors.push({text: "please enter the word"})
    }
    if (errors.length > 0) {
        res.render('links/add', {
            errors: errors,
            wordFind: req.body.wordFind
        })
    } else {
        const newUser = {
            wordFind: req.body.wordFind,
            link: `http://www.${req.body.wordFind}.com`,
            user: req.body.id,
            from: (req.body.from),
            to: (req.body.to)
        };
        new Link(newUser)
            .save()
    }
})

router.delete('/:id', (req, res)=>{
    res.send('delete')
});
module.exports = router;