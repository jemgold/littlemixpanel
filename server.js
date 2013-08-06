var express = require('express')
  , handler = require('./handler.js')
  , littleprinter = require('littleprinter')
  , asciify = require('asciify')
  , _ = require('underscore')
  , md5 = require('MD5')
  , Mixpanel = require('mixpanel-data');

var app = express();
var port = process.env.PORT || 5000;

app.set('view engine', 'ejs');

app.get('/edition', function(req, res) {
  var client = new Mixpanel({
    apiKey: process.env.MIXPANEL_API_KEY
  , apiSecret: process.env.MIXPANEL_API_SECRET
  });

  client.fetchEvents(function() {
    var sortedEvents = _.sortBy(client.data.events, function(event) {
      return event.amount;
    });

    var filteredEvents = _.filter(sortedEvents, function(event) {
      return event.amount !== 0;
    });

    res.set({
      'Content-Type': 'text/html',
      'ETag': md5('language' + new Date())
    });

    res.charset = 'utf-8';

    res.render('edition', {
      locals: {
        events: filteredEvents
      }
    });
  });
});

littleprinter.setup(app, handler);

app.listen(port);

console.log('Server started on: http://localhost:' + port);

