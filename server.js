const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 9200; // done for Heroku
var app = express();

//register your common partial files here
hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine', 'hbs');

app.use((req, res, next) => {
    const now = new Date().toString();
    let log = `${now}: ${req.method} ${req.originalUrl}`;
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append to server.log');
        }
    });
    next();
});

//since the code below doesn't have next(), it will prevent other pages from accessing
// app.use((req, res, next) => {
//     res.render('maintenace.hbs');
// });

//order matters, if this is used before maintenace.hbs, user can access help.html
app.use(express.static(__dirname + '/public')); // middleware

//register your functions here
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear()
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

app.get('/', (req, res) => {
    // res.send('<h1>Hello express!</h1>');
    res.send({
        name: 'PT',
        likes: ['Tennis', 'Running']
    })
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page'
    });
    // res.send('<h2>About Page</h2>');
});

app.get('/home', (req, res) => {
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: 'Hello From Chamblee'
    });
    // res.send('<h2>About Page</h2>');
});

app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'Unable to handle request'
    })
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});