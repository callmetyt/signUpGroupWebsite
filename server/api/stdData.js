const express = require('express');
const router = express.Router();
const mongo = require('../mongo/std');

// 这里的路由会是app.use('url')中的url+'/'
router.get('/', (req, res) => {
    //获取组织名
    let organization = req.query.organization;
    mongo.students.find({
        $or: [{
            organizationFirst: organization
        }, {
            organizationSecond: organization
        }]
        //只有第一或第二志愿存在当前组织才会显示
    }, (err, docu) => {
        if (err) throw err;
        let data = {
            length: docu.length,
            stdDataArr: docu
        }
        res.send(data);
    })
})

module.exports = router;