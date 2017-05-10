var express = require('express');
var router = express.Router();
const fs = require('fs');
var debug = require('debug')('shields:index-route');

var shields = {
    passed: './shields/xAPI-LRS-1.0.3-passed-green.png',
    failed: './shields/xAPI-LRS-1.0.3-failed-red.png',
    warned: './shields/xAPI-LRS-1.0.3-needs-retested-yellow.png'
};

var shieldpath = shields.warned;
var tsversion = '1.0.3.10';

var stuff = {
    andy : {
        anglrs: {
            version: '1.0.3.10',
            status: 'passed'
        },
        weirdlrs: {
            version: '1.0.3.10',
            status: 'failed'
        }
    },
    tom: {
        tomlrs: {
            version: '1.0.3.8',
            status: 'passed'
        }
    }
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', tsversion: tsversion, vendors: stuff });
});

router.post('/', function(req, res, next) {
    var newtsversion = req.body.tsversion;
    if ( newtsversion !== null && newtsversion !== 'undefined' && newtsversion !== '')
        tsversion = newtsversion;
    res.redirect('/');
});

router.get('/:vendor/:lrs/:shield', function(req, res, next) {
    var lrs = stuff[req.params.vendor][req.params.lrs];

    if (lrs.status === 'failed') {
        shieldpath = shields.failed;
    } else if (lrs.version === tsversion) {
        debug('version', lrs.version);
        debug('ts version', tsversion);
        shieldpath = shields.passed;
    } else {
        shieldpath = shields.warned;
    }

    debug('shieldpath', shieldpath);
    var img = fs.readFileSync(shieldpath);
      res.writeHead(200, {'Content-Type': 'image/png' });
      res.end(img, 'binary');

});


module.exports = router;
