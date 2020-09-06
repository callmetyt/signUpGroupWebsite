const express = require('express');
const router = express.Router();
const mongo = require('../mongo/user');

router.post('/', (req, res) => {
  mongo.users.findOne({
    userId: req.body.userId
  }, (err, docu) => {
    if (err) throw err;
    else {
      res.send({
        authority: docu.authority
      })
    }
  })
})

module.exports = router