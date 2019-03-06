const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieSession = require('cookie-session');

const exphbs = require('express-handlebars');
const mailer = require('express-mailer');

app.engine('handlebars', exphbs({}));
app.set('view engine', 'handlebars');

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


mailer.extend(app, {
    from: 'zakupkigov.grabber@mail.ru',
    host: 'smtp.mail.ru', // hostname
    secureConnection: true, // use SSL
    port: 465, // port for secure SMTP
    transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
    auth: {
        user: 'zakupkigov.grabber@mail.ru',
        pass: 'Qwertyuiop1!'
    }
});


app.get('/results/mail', function (req, res, next) {
    app.mailer.send('email', {
        to: req.query.user, // REQUIRED. This can be a comma delimited string just like a normal email to field.
        subject: 'Tenders', // REQUIRED.
        links: req.query.links // All additional properties are also passed to the template as local variables.
    }, function (err) {
        if (err) {
            // handle error
            console.log(err);
            res.send('There was an error sending the email');
            return;
        }
        res.send('Email Sent');
    });
});


const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`server is on port ${port}`)
});

