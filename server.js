'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var dns = require('dns');

var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;


mongoose.connect(process.env.MONGOLAB_URI, {"dbName": 'FCC_Projects'});

app.use(cors());


app.use(bodyParser.urlencoded({extended: 'false'}));
app.use(bodyParser.json());

let urlSchema = new mongoose.Schema({url: String, shortUrl: Number});
let urlModel = mongoose.model('urls', urlSchema);



app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});


app.post('/api/shorturl/new', (req, res) => {
  let validURLSyntax = /^https?:\/\/([\w]+[.])?([^./]+[.])+\w+(\/[^/]+)*\/?$/i;
  if (validURLSyntax.test(req.body.url) === false) {
    res.json({"error": "invalid url"});
  } else {
    dns.lookup(req.body.url.match(/^https?:\/\/([^/]+)/i)[1], err => {
      console.log(err);
      if (err) {return res.json({"error": "invalid url"})};
      urlModel.findOne({url: req.body.url}, (err, data) => {
        if (err) {return res.json({"error": "there was an error"})};
        if (data) {
          res.json({"original_url": data.url, "short_url": data.shortUrl});
        } else {
          urlModel.estimatedDocumentCount((err, count) => {
            if (err) {return res.json({"error": "there was an error"})};
            let doc = new urlModel({url: req.body.url, shortUrl: count});
            doc.save((err, data) => {
            if (err) {return res.json({"error": "there was an error"})};
            res.json({"original_url": data.url, "short_url": data.shortUrl});
            })
          })
        }
      })
    })
  }
})

app.get('/api/shorturl/:shortUrl', (req, res) => {
  urlModel.findOne({shortUrl: req.params.shortUrl}, (err, data) => {
    if (err) {return res.send({"error": "there was an error"})};
    if (data) {
      res.redirect(data.url);
    } else {
      res.sendFile(process.cwd() + '/views/noshorturl.html');
    }
  })
})

//Unmatched routes
app.use((req, res) => {
  if (req.accepts('html') == 'html') {
    res.sendFile(process.cwd() + '/views/error.html');
  } else {
    res.status(404).type('txt').send('Not Found');
  }
})
  

app.listen(port, () => {
  console.log('Node.js listening ...');
});
