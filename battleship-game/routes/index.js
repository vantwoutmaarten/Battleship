var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/splash', function(req, res) {
  res.render('splash.html', { title: 'Express' });
});


/* Pressing Play gives this page */ 
router.get('/game.html', function(req, res) {
  res.render('game.html', { title: 'Express' });
});

module.exports = router;
