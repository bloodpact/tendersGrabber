const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');
const axios = require('axios');
const moment = require('moment');
const convert = require('xml-js');

require('../models/Link');
const Link = mongoose.model('links');

async function getLinks(userID){
    return await  Link.find({user: userID})
        .sort({date: 'desc'})
        .then(links => {return links});
}

async function requestToFindTenders(word, from, to){
  const response = await axios.get('http://zakupki.gov.ru/epz/order/quicksearch/rss', {
        params: {
            searchString: word,
            morphology:'on',
            openMode:'USE_DEFAULT_PARAMS',
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
            publishDateFrom: from,
            publishDateTo:to,
            regionDeleted:false,
            oktmoIdsWithNested:'on',
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
    return  await Promise.all(arrWords.map(async (currentValue) => {
            return await requestToFindTenders(currentValue.wordFind, currentValue.from, currentValue.to);
        })
    );
}
router.get('/',ensureAuthenticated, async(req, res)=>{
    let tenders = await getArrTenders(req.user.id);
    res.render('results/index',{
        data:  [].concat.apply([], tenders)
    });
});

module.exports = router;