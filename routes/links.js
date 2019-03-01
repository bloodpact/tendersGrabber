const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../config/auth');
const {formateDate} = require('../helpers/dateFormater');
const moment = require('moment');

require('../models/Link');
const Link = mongoose.model('links');

router.get('/', ensureAuthenticated, (req, res) => {
    Link.find({
        user: req.query.user
        })
        .sort({date: 'desc'})
        .then(links => {
            console.log(links)
            res.send(links)
        })
        .catch(err=>{
        return res.status(400).json({msg:err})
    })
});

router.get('/:id',ensureAuthenticated, (req, res) =>{
    Link.findOne({
        _id: req.params.id
        })
        .then(link=>{
         res.send(link)
         })
        .catch(err=>{
         return res.status(400).json({msg:err})
    })
});

router.put('/:id', ensureAuthenticated, (req, res)=>{
    Link.findOne({
            _id: req.params.id
        })
        .then(link =>{
            link.wordFind = req.body.wordFind;
            link.link = `http://www.${req.body.wordFind}.com`;
            link.dateFrom = req.body.dateFrom;
            link.dateTo = req.body.dateTo;
            link.save()
        })
        .catch(err=>{
             res.status(400).json({msg:err})
        })
});
router.post('/',ensureAuthenticated, (req, res) =>{
    let errors = [];
    if (!req.body.wordFind) {
        errors.push({text: "please enter the word"})
    }
    if (errors.length > 0) {
        res.send({
            errors: errors,
            wordFind: req.body.wordFind
        })
    } else {
        const newLink = {
            wordFind: req.body.wordFind,
            link: `http://www.${req.body.wordFind}.com`,
            user: req.body.id,
            dateFrom:req.body.dateFrom,
            dateTo: req.body.dateTo,
            check24: req.body.check24
        };
        new Link(newLink)
            .save()
            .then(()=>{
                res.status(200).json({msg:'successful updated'})
            })
            .catch(err=>{
             return  res.status(400).json({msg:err})
            })
    }
})

router.delete('/:id', ensureAuthenticated,(req, res)=>{
    Link.deleteOne({
            _id: req.params.id
        })
        .then(()=>{
            res.status(200).json({msg:'successful deleted'})
        })
        .catch(err=>{
            res.status(400).json({msg:err})
        })
});

module.exports = router;