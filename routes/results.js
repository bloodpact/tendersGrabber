const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');
const axios = require('axios');



router.get('/', (req, res)=>{
    axios({
        method:'get',
        url : 'http://zakupki.gov.ru/epz/order/quicksearch/rss',
        params: {
            searchString: 'масло'
        },
        headers: {
            'accept': 'application/json',
            'content-type': 'text/plain;charset=utf-8'
        },
    })
        .then((response)=>{
            console.log(response)
            res.render('results/index',{
                data: response.data
            })
        })
        .catch((err)=>{
            console.log(err)
        });
});

module.exports = router;