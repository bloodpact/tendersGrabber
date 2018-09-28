const express = require('express');
const methodOverride = require('method-override');
const path = require('path');
const app = express();
const flash = require('connect-flash');
const session = require('express-session');
const port = process.env.PORT || 5000;
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
mongoose.promise = global.Promise;

//static
app.use(express.static(path.join(__dirname, 'public')))

//exp session
app.set('trust proxy', 1); // trust first proxy
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));
//flash msg
app.use(flash());
//global vars
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});


//routes
const links = require('./routes/links');
const users = require('./routes/users');

mongoose.connect('mongodb://localhost/parser-dev', {
    useNewUrlParser: true
})
    .then(() => {
        console.log('MongoDB connected')
    })
    .catch(err => console.log(err));
//for puts req
app.use(methodOverride('_method'));
//mdw bodyparser
app.use(bodyParser.urlencoded({extended: false}));
//hbs
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
    const title = 'Homepage';
    res.render('index', {
        title: title
    })
});
app.get('/about', (req, res) => {
    res.render('about')
});


app.use('/links', links);
app.use('/users', users);
app.listen(port, () => {
    console.log(`server is on port ${port}`)
});