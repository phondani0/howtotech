const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override')
const hbs = require('./helpers/hbs');
const passport = require('passport');
const session = require('express-session');
const multer = require('multer');

// Multer Configuration 
const fileStorage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, 'images');
    },
    filename : (req, file, cb) => {
        cb(null, new Date().toDateString().replace(/:/g, '-')+'-'+file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if( file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' ){
        cb(null, true);
    } else{
        cb(null, false);
    }
};


// import mongodb_uri
const {
    mongodb_uri
} = require('./config/db');

mongoose.connect(mongodb_uri, {
    useNewUrlParser : true, 
    useUnifiedTopology : true,
    useFindAndModify : false
})
.then(() => {
        console.log(`Connected to MongoDB`);
    })
    .catch((e) => {
        console.log(`Error: ${e.message}`);
    });

    // Supress the deprication warning for FindAndModify
    mongoose.set('useFindAndModify', false);

// import routes
const index = require('./routes/index');
const posts = require('./routes/posts');
const pages = require('./routes/pages');
const admin = require('./routes/admin');

const app = express();

// Multer
app.use(multer({ storage : fileStorage, fileFilter : fileFilter }).single('header_img'));

// Static files
app.use(express.static(__dirname + '/public'));
app.use('/images', express.static(__dirname + '/images'));

// View Engine
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    helpers: {
        dateString: hbs.dateString,
        getDate: hbs.getDate,
        select: hbs.select,
        toBase64: hbs.toBase64
    }
}));
app.set('view engine', 'handlebars');

// MethodOverride
app.use(methodOverride('_method'));

// Bodyparser
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());


// Load Passport config
require('./config/passport')(passport);

app.use(session({
    secret: 'aodfajdaf',
    resave: false,
    saveUninitialized: true
}));

// Init Passport
app.use(passport.initialize());
app.use(passport.session());

// Global vars
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

// log req method and path
app.use((req, res, next) => {
    console.log(`Req : ${req.method}  ${req.url}`);
    next();
});

// Routes
app.use('/', index);
app.use('/posts', posts);
app.use('/pages', pages);
app.use('/admin', admin);

// Handle  Errors
app.use((req, res, next) => {
    let error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    if (err) {
        console.log(`Error: ${err.message} Status: ${err.status}`);
    }
    return res.status(err.status || 500).send();
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
}).on('error', (err) => {
    console.log('\x1b[31m%s\x1b[0m', 'Unable to start the server');
    console.log(`Error: ${err.message}`);
});
