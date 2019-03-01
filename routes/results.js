const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../config/auth');
const {formateDate} = require('../helpers/dateFormater');
const axios = require('axios');
const convert = require('xml-js');
const moment = require('moment')
require('../models/Link');
const Link = mongoose.model('links');

async function getLinks(userID){
    return await  Link.find({user: userID})
                      .then(links => {
                          console.log(links)
                          return links
                      })
                      .catch (err=>{console.log(err)});
}

async function requestToFindTenders(word, from ,to){
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
            publishDateFrom:from,
            publishDateTo:to,
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
async function getArrTenders(userID, from, to){
    const arrWords = await getLinks(userID);
    // console.log(arguments[1])
    try{
        if (arguments[1] !== undefined){
            return  await Promise.all(arrWords.map(async (currentValue) => {
                console.log('no dates')
                    //if 24check
                    return await requestToFindTenders(currentValue.wordFind,
                        from,
                        to);
                })
            )
        } else {
            return  await Promise.all(arrWords.map(async (currentValue) => {
                    console.log('with dates')
                    //if checking range of dates
                return await requestToFindTenders(currentValue.wordFind,
                    formateDate(currentValue.dateFrom),
                    formateDate(currentValue.dateTo))
            })
            )
        }
    } catch (err){
        console.log(err)
    }
}

router.get('/',ensureAuthenticated, async(req, res)=>{
    if(req.query.from !== undefined && req.query.to !== undefined){
        let tenders = await getArrTenders(req.query.user, req.query.from, req.query.to);
        res.send([].concat.apply([], tenders))
    } else {
        let tenders = await getArrTenders(req.query.user);
        res.send([].concat.apply([], tenders))

    }
});
module.exports = router;
