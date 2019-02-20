const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../config/auth');
const axios = require('axios');
const convert = require('xml-js');

require('../models/Link');
const Link = mongoose.model('links');

async function getLinks(userID){
    return await  Link.find({user: userID})
                      .then(links => {return links})
                      .catch (err=>{console.log(err)});
}

async function requestToFindTenders(word){
    const response = await axios.get('http://zakupki.gov.ru/epz/order/quicksearch/rss', {
        params: {
            searchString: word,
            morphology:'on',
            pageNumber:1,
            sortDirection:false,
            recordsPerPage: '_10',
            showLotsInfoHidden:false,
            fz44:'on',
            fz223:'on',
            ppRf615:'on',
            af:'on',
            ca:'on',
            pc:'on',
            pa:'on',
            currencyIdGeneral:'-1',
            publishDateFrom:'19.02.2019',
            publishDateTo:'20.02.2019',
            regionDeleted:false,
            sortBy:'UPDATE_DATE'
        },
        headers: {
            'accept': 'application/json',
            'content-type': 'text/plain;charset=utf-8'
        }
    });
    return (JSON.parse(convert.xml2json(response.data, {compact: true, spaces: 4})).rss.channel.item);
}
async function getArrTenders(userID){
    const arrWords = await getLinks(userID);
    try{
        return  await Promise.all(arrWords.map(async (currentValue) => {
                return await requestToFindTenders(currentValue.wordFind);
            })
        )
    } catch (err){
        console.log(err)
    }
}

router.get('/',ensureAuthenticated, async(req, res)=>{
    let tenders = await getArrTenders(req.query.user);
    res.send([].concat.apply([], tenders))
});
module.exports = router;
