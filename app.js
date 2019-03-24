const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');

const app = express();

// Static files
app.use(express.static(__dirname + '/public'));

// View Engine
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

app.use((req, res, next) => {
    console.log(`Req : ${req.method}  ${req.url}`);
    next();
});

// Routes
app.get('/', (req, res) => {
    res.render('index/index');
});

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