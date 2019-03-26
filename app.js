const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override')

mongoose.connect('mongodb://localhost:27017/howtotech', {
        useNewUrlParser: true
    })
    .then(() => {
        console.log(`Connected to MongoDB`);
    })
    .catch((e) => {
        console.log(`Error: ${e.message}`);
    });

// import routes
const index = require('./routes/index');
const posts = require('./routes/posts');

const app = express();

// Static files
app.use(express.static(__dirname + '/public'));

// View Engine
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// MethodOverride
app.use(methodOverride('_method'));

// Bodyparser
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

// log req method and path
app.use((req, res, next) => {
    console.log(`Req : ${req.method}  ${req.url}`);
    next();
});

// Routes
app.use('/', index);
app.use('/posts', posts);

// Log errors
app.use((err, req, res, next) => {
    if (err) {
        console.log(`Error: ${err.message}`);
    }
    return res.status(500).send();
});

const port = process.env.PORT || 3000;

app.listen(port, (err) => {
    if (err) {
        console.log(`Error: ${err.message}`);
    } else {
        console.log(`Server started on port ${port}`);
    }
});