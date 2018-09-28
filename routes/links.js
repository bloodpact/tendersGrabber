const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//model
require('../models/Link');
const Link = mongoose.model('links');

router.get('/', (req, res) => {
    Link.find({})
        .sort({date: 'desc'})
        .then(links => {
            res.render('links/index', {
                links: links
            })
        })
});
router.get('/add', (req, res) => {
    res.render('links/add')
});

//edit
router.get('/edit/:id',(req, res)=>{
    Link.findOne({
        _id: req.params.id
    })
        .then(link=>{
            res.render('links/edit', {
                link:link
            })
        })
});
//put
router.put('/:id',(req, res)=>{
    Link.findOne({
        _id: req.params.id
    })
        .then(link =>{
            link.wordFind = req.body.wordFind;
            link.link = `http://www.${req.body.wordFind}.com`;
            link.save()
                .then(link=>{
                    req.flash('success_msg' , 'Link updated');
                    res.redirect('/links')
                })
        })
});
router.post('/', (req, res) => {
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
            link: `http://www.${req.body.wordFind}.com`
        };
        new Link(newUser)
            .save()
            .then(link => {
                req.flash('success_msg' , 'Link added');
                res.redirect('/links')
            })
    }
});
//del
router.delete('/:id', (req, res)=>{
    Link.remove({
        _id: req.params.id
    })
        .then(()=>{
            req.flash('success_msg' , 'Link removed');
            res.redirect('/links')
        })
});


module.exports = router;