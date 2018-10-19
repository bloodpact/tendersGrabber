const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');
const axios = require('axios');
const convert = require('xml-js');

require('../models/Link');
const Link = mongoose.model('links');

function test(){
 return  Link.find()
        .sort({date: 'desc'})
        .then(links => {
            console.log(links)
            for (i in links){

             return   axios({
                    method:'get',
                    url : 'http://zakupki.gov.ru/epz/order/quicksearch/rss',
                    params: {
                        searchString: links[i].wordFind,
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
                        publishDateFrom:'01.10.2018',
                        publishDateTo:'05.10.2018',
                        regionDeleted:false,
                        oktmoIdsWithNested:'on',
                        sortBy:'UPDATE_DATE'
                    },
                    headers: {
                        'accept': 'application/json',
                        'content-type': 'text/plain;charset=utf-8'
                    },
                })
                    .then((response)=>{
                        const resp = convert.xml2json(response.data, {compact: true, spaces: 4});
                        const result = (JSON.parse(resp).rss.channel.item);
                        return  result
                    })
                    .catch((err)=>{
                        console.log(err)
                    });
            }
    });
}
test().then(function(result) { console.log(result, 1); })

// testAxios()
router.get('/', (req, res)=>{
    Link.find()
        .sort({date: 'desc'})
        .then(links => {
            axios({
                method:'get',
                url : 'http://zakupki.gov.ru/epz/order/quicksearch/rss',
                params: {
                    searchString: links[0].wordFind,
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
                    publishDateFrom:'01.10.2018',
                    publishDateTo:'05.10.2018',
                    regionDeleted:false,
                    oktmoIdsWithNested:'on',
                    sortBy:'UPDATE_DATE'
                },
                headers: {
                    'accept': 'application/json',
                    'content-type': 'text/plain;charset=utf-8'
                },
            })
                .then((response)=>{
                    const resp = convert.xml2json(response.data, {compact: true, spaces: 4});
                    const result =(JSON.parse(resp).rss.channel.item);
                    res.render('results/index',{
                        data:  result
                    });
                })
                .catch((err)=>{
                    console.log(err)
                });
        });
});

module.exports = router;