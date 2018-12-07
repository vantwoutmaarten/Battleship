var express = require('express');
var router = express.Router();


/* Test */
//router.get('/', (req,res) => res.send('Hello World'));

/* GET home page. */
router.get('/', function(req, res) {
  res.render('splash', { title: 'Express' });
});


/* Pressing Play gives this page */ 
router.get('/game', function(req, res) {
  res.render('game', { title: 'Express' });
});

module.exports = router;