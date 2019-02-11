const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');

require('../models/User');
const User = mongoose.model('users');

router.post("/login", (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).send([user, "Cannot log in", info])
        }
        req.login(user, (err) => {
            console.log(req.session)
            res.send(user._id)
        })
    })(req, res, next)
})
router.post('/register', (req, res)=>{
    let errors =[];
    if (req.body.password !== req.body.password2) {
        errors.push({text: 'Passwords do not match'});
    }
    if (req.body.password.length < 4){
        errors.push({text: 'Password should have more than 4 characters'});
    }
    if (errors.length > 0){
        res.send(errors)
    } else {
        User.findOne({email: req.body.email})
            .then(user=>{
                if(user){
                    res.send('Email is already registered')
                }else{
                    const newUser = new User({
                        name:req.body.name,
                        email:req.body.email,
                        password:req.body.password
                    });
                    bcrypt.genSalt(10, (err, salt)=>{
                        bcrypt.hash(newUser.password, salt, (err, hash)=>{
                            if (err) throw  err;
                            newUser.password = hash;
                            newUser.save()
                                .catch(err=>{
                                    console.log(err);
                                    return;
                                })
                        })
                    });
                }
            });
    }
});
module.exports = router;