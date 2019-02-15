const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieSession = require('cookie-session');

mongoose.promise = global.Promise;
app.use(morgan('dev'));
app.use(cors());

// app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//passport
app.use(passport.initialize());
// app.use(passport.session());
//routes
const links = require('./routes/links');
const users = require('./routes/users');
const results = require('./routes/results');


require('./config/passport')(passport);

//mongo
mongoose.connect('mongodb://localhost/parser-dev', {
        useNewUrlParser: true
    })
    .then(() => {
        console.log('MongoDB connected')
    })
    .catch(err => console.log(err));

//routes
app.use('/links', links);
app.use('/users', users);
app.use('/results', results);

app.get('/',(req, res)=>{
    res.send('root')
})

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`server is on port ${port}`)
});

