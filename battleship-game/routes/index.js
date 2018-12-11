var express = require('express');
var router = express.Router();


/* Test */
//router.get('/', (req,res) => res.send('Hello World'));

/* GET home page. */
router.get('/', function(req, res) {
  session = req.session;
  if (session.views) {
		session.views++;
		sesmessage ="You have been here " + session.views + " times (last visit: " + session.lastVisit + ")";
		session.lastVisit = new Date().toLocaleDateString();
	}
	else {
		session.views = 1;
		session.lastVisit = new Date().toLocaleDateString();
		sesmessage ="This is your first visit!"; 
	}

  sessioninfo = [];
  sessioninfo.push({ message:"" + sesmessage, title: "Statistics:"});
  res.render('splash', { title: 'Express' , ses_array: sessioninfo});
});


/* Pressing Play gives this page */ 
router.get('/game', function(req, res) {
  res.render('game', { title: 'Express' });
});

module.exports = router;