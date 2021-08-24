module.exports = function checkValue(data, res) {
  let nameReg = /^[\u4E00-\u9FA5]{2,10}$/;
  let phoneReg = /^1[3456789]\d{9}$/;
  let idReg = /^(2020)(\d{4})?$/;
  for (let key in data) {
    if (
      key === "advanceWill" ||
      key === "advanceReason" ||
      key === "secondWill" ||
      key === "secondReason"
    ) {
      continue;
    }
    if (data[key] === undefined || data[key] === " ") {
      res.send({
        status: false,
        content: '有漏填的消息哦'
      })
      return;
    }
  }
  if (!idReg.test(data.stdId)) {
    res.send({
      status: false,
      content: '学号填错了哦(格式：2020xxxx)'
    })
    return;
  } else if (!nameReg.test(data.stdName)) {
    res.send({
      status: false,
      content: '姓名不合法'
    })
    return;
  } else if (!phoneReg.test(data.stdPhone)) {
    res.send({
      status: false,
      content: '电话不合法'
    })
    return;
  } else if (data.organizationFirst == undefined) {
    res.send({
      status: false,
      content: '未填选第一志愿'
    })
    return;
  } else if (
    data.organizationFirst === data.organizationSecond &&
    data.branchFirst == data.branchSecond
  ) {
    res.send({
      status: false,
      content: '第一和第二志愿不能重复'
    })
    return;
  }
  return true;
}