const express = require("express");
const router = express.Router();
const mongo = require("../mongo/std");
const checkValue = require("./checkValue");

// 这里的路由会是app.use('url')中的url+'/'
router.post("/", async (req, res) => {
  if (checkValue(req.body, res)) {
    let data = req.body;
    if (global.userToken[req.body.userId] === req.body.userToken) {
      let result = await mongo.students.updateOne(
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
        }
      );
      if (result.ok == 1) {
        res.send({
          status: true,
          content: "修改成功!",
        });
      }
    }
  }
});

module.exports = router;
