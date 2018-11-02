const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');
const moment = require('moment');

//model
require('../models/Link');
const Link = mongoose.model('links');

router.get('/', ensureAuthenticated, (req, res) => {
    Link.find({user: req.user.id})
        .sort({date: 'desc'})
        .then(links => {
            res.render('links/index', {
                links: links
            })
        })
});
router.get('/add',ensureAuthenticated, (req, res) => {
    res.render('links/add')
});

//edit
router.get('/edit/:id', ensureAuthenticated,(req, res)=>{
    Link.findOne({
        _id: req.params.id
    })
        .then(link=>{
            if(link.user !== req.user.id){
                req.flash('error_msg', 'not authorized')
                res.redirect('/links')
            } else{
                res.render('links/edit', {
                    link:link
                })
            }
        })
});
//put
router.put('/:id', ensureAuthenticated, (req, res)=>{
    Link.findOne({
        _id: req.params.id
    })
        .then(link =>{
            link.wordFind = req.body.wordFind;
            link.link = `http://www.${req.body.wordFind}.com`;
            link.from = moment(req.body.from).format('DD.MM.YYYY');
            link.to = moment(req.body.to).format('DD.MM.YYYY');
            link.save()
                .then(link=>{
                    req.flash('success_msg' , 'Link updated');
                    res.redirect('/links')
                })
        })
});
router.post('/', ensureAuthenticated, (req, res) => {
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
            user: req.user.id,
            from: moment(req.body.from).format('DD.MM.YYYY'),
            to: moment(req.body.to).format('DD.MM.YYYY')
        };
        new Link(newUser)
            .save()
            .then(link => {
                console.log(link);
                req.flash('success_msg' , 'Link added');
                res.redirect('/links')
            })
    }
});
//del
router.delete('/:id', ensureAuthenticated,(req, res)=>{
    Link.deleteOne({
        _id: req.params.id
    })
        .then(()=>{
            req.flash('success_msg' , 'Link removed');
            res.redirect('/links')
        })
});


module.exports = router;