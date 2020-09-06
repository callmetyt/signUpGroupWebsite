const express = require('express');
const router = express.Router();
const mongo = require('../mongo/std');

// 这里的路由会是app.use('url')中的url+'/'
router.post('/', (req, res) => {
    mongo.students.findOne({
        stdId: req.body.stdId
    }, (err, docu) => {
        if (err) throw err;
        //插入新数据
        if (docu === null || docu === undefined) {
            new mongo.students(req.body).save((err, docu) => {
                if (err) throw err;
                res.send({
                    status: true
                });
            })
        } else if (req.body.authority === 'super') {
            //更新数据
            let data = req.body;
            mongo.students.updateOne({
                _id: data._id //通过唯一标识_id确定数据
            }, {
                //新的数据（无论是否修改）
                stdId: data.stdId,
                stdName: data.stdName,
                stdQQ: data.stdQQ,
                stdPhone: data.stdPhone,
                major: data.major,
                classNum: data.classNum,
                organizationFirst: data.organizationFirst,
                branchFirst: data.branchFirst,
                reasonFirst: data.reasonFirst,
                organizationSecond: data.organizationSecond,
                branchSecond: data.branchSecond,
                reasonSecond: data.reasonSecond,
                isDispensing: data.isDispensing
            }, (err, raw) => {
                //必须有这个回调函数，才能修改成功？？？
                if (err) throw err;
            })
            res.send({
                status: true,
                content: '已修改为新的数据'
            })
        } else {
            //重复提交
            res.send({
                status: false,
                content: '请勿重复提交（请检查学号是否正确!）'
            })
        }
    })
})

module.exports = router;