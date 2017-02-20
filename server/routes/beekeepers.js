var models  = require('../models');
var express = require('express');
var router = express.Router();

// add a beekeeper
router.post('/beekeeper', function(req, res) {
  models.Beekeeper.create({
    name: req.body.name
  }).then(function(beekeeper) {
    res.json(beekeeper);
  });
});

// get all beekeepers
router.get('/beekeepers', function(req, res) {
  models.Beekeeper.findAll({}).then(function(beekeepers) {
    res.json(beekeepers);
  });
});

module.exports = router;
