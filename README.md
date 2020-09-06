# signUpGroupWebsite
报名系统，并拥有一个后台管理(尚未完善)，基于vue,node和mongoose
学生组织报名系统

1.报名页面

(1)填写学生的姓名学号专业班级及qq号和手机号
每个专业对应的班级不同，如计算机信安有四个班，大数据物联只有两个班，中加有六个班，需要做专业与班级的select的联动
接口
post方法

    {
      stdId:String, //学号
      stdName:String, //姓名
      major:String,  //专业
      classNum:String, //班级
      stdQQ:String, //学生qq
      stdPhone:String //学生手机号
    }

(2)填写一志愿以及二志愿
各部门详情:

---

"团委":"组织部","宣传部","心协","青协"

---

"学生会":"办公室","学习部","宣传部","文艺部","体育部","外联部","自管会"

---

"科技协会":"科技协会"

---

"勤工助学中心":"管理部","活动部","助贷部","外联部"

---

"新闻中心":"摄影协会","新媒体部","记者团"

---

每个组织对应的部门不同，对组织及下属部门的select需要做联动
接口:

    firstWill:{ //第一志愿
        organization:String, //组织名
        branch:String, //下属部门
        reason:String, //加入该组织的原因
    }
    secondWill:{ //第二志愿
        organization:String, //组织名
        branch:String, //下属部门
        reason:String, //加入该组织的原因
    }

(3)提交的接口

    data:{
        stdId:String,
        stdName:String,
        major:String,
        classNum:String,
        stdQQ:String,
        stdPhone:String,
        firstWill:{
            organization:String, 
            branch:String, 
            reason:String
        },
        secondWill:{
            organization:String, 
            branch:String, 
            reason:String
        },
        isDispensing:Boolean //是否调剂
    }
    返回：
    { status: true } //成功
    { status:false content:'学号重复'}//失败，打印出失败原因

2.登陆页面

分为普通管理员和超级管理员
主要是后端进行区分
接口:
必须为post方法

    {
        username:String,//用户名
        passowrd:String //密码
    }

3.后台页面

普通管理员只能看所属组织的填报志愿
可以用get方法，发送用户名，然后后端返回数据
前端使用sessionStorage存用户名，实现跨页面传值

    data:{
        stdId:String,
        stdName:String,
        major:String,
        classNum:String,
        stdQQ:String,
        stdPhone:String,
        firstWill:{
            organization:String, 
            branch:String, 
            reason:String
        },
        secondWill:{
            organization:String, 
            branch:String, 
            reason:String
        },
        isDispensing:Boolean //是否调剂
    }

UI

自行设计，怎么好看怎么整
如果对自己的审美没有信心，也可以使用现成的UI框架
Bootstrap,基于jq的materialize 等等...更多的自行搜索

拦截

点击提交报名表的时候，要拦截一下，比如不能为空，或是非法学号(学号必须为8位，前四位为2020)等

# 修改

## 修改需求

- 已添加修改按钮 可以修改所有信息

## 调剂功能没有...

- 已添加

## 管理员分级

- super
  - 可修改
- normal
  - 不可

## 组织查询

- 只能查到自己组织的
  - 无论第一还是第二志愿

## 其他问题

- Excel表格导出还没有完成...

- 组织接口问题

  - 正在使用的形式

    ```javascript
        organizationFirst: String,
        branchFirst: String,
        reasonFirst: String,
        organizationSecond: String,
        branchSecond: String,
        reasonSecond: String,
    ```

  - 接口文档的形式

    ```javascript
        firstWill:{
            organization:String, 
            branch:String, 
            reason:String
        },
        secondWill:{
            organization:String, 
            branch:String, 
            reason:String
        },
    ```

  - 如果修改为接口文档形式，后天查询表格UI组件无法显示全部

- 如果超级管理员修改学号为另一个已经存储在数据库的学号，则会因为`_id`重复而报错
- 后台报名情况的背景布局问题
- 组织和班级没有修改，沿用之前的接口（据说20级校级组织会发生变化？）

