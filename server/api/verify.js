const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    if (global.userToken[req.body.userId] === req.body.userToken) {
        res.send({
            status: true
        });
    } else {
        res.send({
            status: false
        });
    }
})

module.exports = router;