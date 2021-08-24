const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const signUp = require("./api/signUp.js");
const stdData = require("./api/stdData.js");
const login = require("./api/login.js");
const verify = require("./api/verify.js");
const authority = require("./api/authority.js");
const changeAll = require('./api/changeAll')
app.all("*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});
global.userToken = {};
// app.use(express.static(__dirname + "/public"));
app.use(jsonParser);
app.use('/changeAll', changeAll)
app.use("/signUp", signUp);
app.use("/stdData", stdData);
app.use("/login", login);
app.use("/verify", verify);
app.use("/authority", authority);

app.listen(8088, () => console.log("running on the port 8088"));