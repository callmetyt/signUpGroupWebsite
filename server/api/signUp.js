const express = require("express");
const router = express.Router();
const mongo = require("../mongo/std");
const checkValue = require("./checkValue");

// 这里的路由会是app.use('url')中的url+'/'
router.post("/", (req, res) => {
  if (checkValue(req.body, res)) {
    mongo.students.findOne(
      {
        stdId: req.body.stdId,
      },
      (err, docu) => {
        if (err) throw err;
        //初次提交
        //插入新数据
        if (docu === null || docu === undefined) {
          new mongo.students(req.body).save((err, docu) => {
            if (err) throw err;
            res.send({
              status: true,
              content: "初次提交成功！",
            });
          });
        } else if (req.body.authority === "super") {
          if (global.userToken[req.body.userId] === req.body.userToken) {
            //管理员修改
            //更新数据
            let data = req.body;
            mongo.students.updateOne(
              {
                _id: data._id,
              },
              {
                //新的数据（无论是否修改）
                stdId: data.stdId,
                stdName: data.stdName,
                stdQQ: data.stdQQ,
                stdPhone: data.stdPhone,
                major: data.major,
                classNum: data.classNum,
                organizationAdvance: data.organizationAdvance,
                branchAdvance: data.branchAdvance,
                reasonAdvance: data.reasonAdvance,
                organizationFirst: data.organizationFirst,
                branchFirst: data.branchFirst,
                reasonFirst: data.reasonFirst,
                organizationSecond: data.organizationSecond,
                branchSecond: data.branchSecond,
                reasonSecond: data.reasonSecond,
                isDispensing: data.isDispensing,
              },
              (err, doc, res) => {
                if (err) throw err;
                console.log(doc, res);
              }
            );
            res.send({
              status: true,
              content: "已修改为新的数据",
            });
          } else {
            res.send({
              status: false,
              content: "鉴权失败",
            });
          }
        } else {
          //重复提交，进行修改
          let data = req.body;
          //基础信息比对
          mongo.students.findOne(
            {
              stdId: data.stdId,
              stdPhone: data.stdPhone,
              stdName: data.stdName,
              stdQQ: data.stdQQ,
            },
            (err, docu) => {
              if (err) throw err;
              if (docu === null || docu === undefined) {
                res.send({
                  status: false,
                  content:
                    "若干基本信息重复并且其余不一致，请检查学号、姓名、qq号和手机号是否正确！",
                });
              } else {
                mongo.students.updateOne(
                  {
                    stdId: data.stdId,
                  },
                  {
                    major: data.major,
                    classNum: data.classNum,
                    organizationAdvance: data.organizationAdvance,
                    branchAdvance: data.branchAdvance,
                    reasonAdvance: data.reasonAdvance,
                    organizationFirst: data.organizationFirst,
                    branchFirst: data.branchFirst,
                    reasonFirst: data.reasonFirst,
                    organizationSecond: data.organizationSecond,
                    branchSecond: data.branchSecond,
                    reasonSecond: data.reasonSecond,
                    isDispensing: data.isDispensing,
                  },
                  (err, raw) => {
                    if (err) throw err;
                  }
                );
                res.send({
                  status: true,
                  content: "已修改为新的数据",
                });
              }
            }
          );
        }
      }
    );
  }
});

module.exports = router;
