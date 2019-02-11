const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');

export function setEnv(app) {
    if (process.env.NODE_ENV !== 'prod'){
        setDevEnv(app)
    } else {
        setProdEnv(app)
    }
}

function setDevEnv(app) {
    process.env.NODE_ENV = 'dev';
    process.env.DB_URL = 'mongodb://localhost/parser-back-dev'
    app.use(morgan);
    app.use(cors);
    app.use(bodyParser.json());
    console.log('dev env')
}

function setDevEnv(app) {
    process.env.NODE_ENV = 'prod';
    process.env.DB_URL = 'mongodb://localhost/parser-back-dev'
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
    // app.use(express.static(__dirname + '/../dist'))
    console.log('prod env')
}