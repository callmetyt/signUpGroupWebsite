<template>
  <div class="layout body">
    <Menu
      mode="horizontal"
      theme="dark"
      active-key="1"
      @on-select="onMenuSelect"
    >
      <div class="layout-logo">SCSE</div>
      <div class="layout-nav">
        <Menu-item key="1" name="nav">
          <Icon type="ios-navigate"></Icon>主页
        </Menu-item>
        <Menu-item key="2" name="seeExcel">
          <Icon type="ios-keypad"></Icon>查看报名情况
        </Menu-item>
        <Menu-item key="3" name="getExcel">
          <Icon type="ios-analytics"></Icon>导出表格
        </Menu-item>
      </div>
    </Menu>
    <div class="layout-content">
      <div v-if="content.nav">
        <div class="index-content">
          <p class="title">欢迎</p>
          <p class="content">管理员权限：{{ userAuthority }}</p>
          <p class="content">管理员所属组织：{{ userOrganization }}</p>
        </div>
      </div>
      <div v-else-if="content.seeExcel">
        <i-table stripe :columns="giveColumns" :data="stdData">
          <template slot="action" slot-scope="{ row }">
            <i-button
              type="default"
              @click="changeData(row)"
              :disabled="isNormal"
              >修改</i-button
            >
          </template>
        </i-table>
        <div class="layout-page">
          <Page :total="totalPages" show-total @on-change="changePage"></Page>
        </div>
      </div>
    </div>
    <div class="layout-copy">2020 &copy; 学生创新实践中心</div>
    <zy-loading :loadingShow="loadingShow"></zy-loading>

    <div class="killBox" v-if="changeWindow.open">
      <Modal
        v-model="changeWindow.open"
        title="信息修改"
        @on-ok="changeSend"
        @on-cancel="changeCancel"
        width="700px"
      >
        <h2 class="firstRow">基本信息</h2>
        <Row :gutter="16">
          <Col span="6">
            <p>学号</p>
            <i-input
              class="input"
              icon="ios-person"
              placeholder="请输入学号"
              v-model="changeWindow.data.stdId"
            ></i-input>
          </Col>

          <Col span="6">
            <p>姓名</p>
            <i-input
              class="input"
              icon="ios-clock"
              placeholder="请输入姓名"
              v-model="changeWindow.data.stdName"
            ></i-input>
          </Col>

          <Col span="6">
            <p>QQ</p>
            <i-input
              class="input"
              icon="qq"
              placeholder="请输入qq号"
              v-model="changeWindow.data.stdQQ"
            ></i-input>
          </Col>

          <Col span="6">
            <p>电话</p>
            <i-input
              class="input"
              icon="ios-phone"
              placeholder="请输入手机号"
              v-model="changeWindow.data.stdPhone"
            ></i-input>
          </Col>

          <Col span="24">
            <p class="content">请选择专业与班级</p>
            <Cascader
              class="select"
              :data="majorData"
              v-model="changeWindow.major"
            ></Cascader>
          </Col>
        </Row>

        <h2 class="secondRow">志愿信息</h2>
        <Row>
          <Col :span="24">
            <p class="content">请选择提前批志愿</p>
            <Cascader
              class="select"
              :data="organizationDataAdvance"
              v-model="changeWindow.will.advance"
            ></Cascader>
            <i-input
              class="select textarea"
              v-model="changeWindow.data.reasonAdvance"
              type="textarea"
              placeholder="请输入加入此组织的理由"
            ></i-input>
          </Col>
          <Col :span="11">
            <p class="content">请选择第一志愿</p>
            <Cascader
              class="select"
              :data="orginazationData"
              v-model="changeWindow.will.first"
            ></Cascader>
            <i-input
              class="select textarea"
              v-model="changeWindow.data.reasonFirst"
              type="textarea"
              placeholder="请输入加入此组织的理由"
            ></i-input>
          </Col>
          <Col :span="11" offset="2">
            <p class="content">请选择第二志愿</p>
            <Cascader
              class="select"
              :data="orginazationDataSecond"
              v-model="changeWindow.will.second"
            ></Cascader>
            <i-input
              class="select textarea"
              v-model="changeWindow.data.reasonSecond"
              type="textarea"
              placeholder="请输入加入此组织的理由"
            ></i-input>
          </Col>
          <Col :span="24">
            <p class="content">是否调剂</p>
            <i-switch v-model="changeWindow.data.isDispensing">
              <span slot="open">是</span>
              <span slot="close">否</span>
            </i-switch>
          </Col>
        </Row>
      </Modal>
    </div>
  </div>
</template>

<script>
import config from "@/config/select.json";
import loading from "@/components/loading.vue";
export default {
  data() {
    return {
      content: {
        nav: true,
        seeExcel: false,
      },
      loadingShow: false,
      stdData: [],
      allData: [],
      totalPages: 0,
      //修改窗口数据
      changeWindow: {
        //是否开启
        open: false,
        //真正的接口数据
        data: {},
        //配合级联选择器的临时数组
        will: {
          first: [],
          second: [],
          advance: [],
        },
        major: [],
      },
      //组织数据
      orginazationData: config.orginazationData,
      organizationDataAdvance: config.organizationAdvance,
      orginazationDataSecond: config.orginazationDataSecond,
      //专业数据
      majorData: config.majorData,
      //管理员权限
      userAuthority: undefined,
      //管理员组织
      userOrganization: undefined,
      //判断管理员组织
      isNormal: true,
    };
  },
  created() {
    let userToken = sessionStorage.getItem("userToken");
    let userId = sessionStorage.getItem("userId");
    this.loadingShow = true;
    if (userToken == undefined || userToken == null) {
      this.$Message.error("非法登陆，请重新登录");
      setTimeout(() => {
        this.$router.push({ path: "/login" });
      }, 500);
    } else {
      let data = {
        userId: userId,
        userToken: userToken,
      };
      this.axios.post(config.serverAddress + "/verify", data).then((res) => {
        if (res.data.status) {
          this.loadingShow = false;
        } else {
          this.$Message.error("非法登陆，请重新登录");
          setTimeout(() => {
            this.$router.push({ path: "/login" });
          }, 500);
        }
      });
    }
  },
  mounted() {
    this.userAuthority = sessionStorage.getItem("userAuthority");
    this.userOrganization = sessionStorage.getItem("userOrganization");
    //查询管理员权限
    this.authoritycheck();
  },
  methods: {
    onMenuSelect(name) {
      if (name == "nav") {
        this.content.nav = true;
        this.content.seeExcel = false;
      } else if (name == "seeExcel") {
        this.content.nav = false;
        this.content.seeExcel = true;
        this.loadingShow = true;
        this.seeExcel(() => {
          setTimeout(() => {
            this.loadingShow = false;
          }, 500);
        });
      } else {
        this.getExcel();
      }
    },
    //从数据库获取数据
    seeExcel(callback) {
      //获取当前管理员所属组织
      let organization = sessionStorage.getItem("userOrganization");
      this.axios
        .get(
          config.serverAddress + "/stdData" + `?organization=${organization}`
        ) //获取学生数据并将组织名当做参数传出
        .then((res) => {
          this.totalPages = res.data.length;
          this.allData = res.data.stdDataArr;
          this.stdData = this.allData.slice(0, 10);
          if (callback) callback();
        });
    },
    changePage(page) {
      let start = 10 * (page - 1);
      this.stdData = this.allData.slice(start, start + 10);
    },
    //打开修改窗口
    changeData(data) {
      //创建要修改的数据
      Object.assign(this.changeWindow.data, data);
      //配合级联选择器
      this.changeWindow.will.advance = [
        this.changeWindow.data.organizationAdvance,
        this.changeWindow.data.branchAdvance,
        this.changeWindow.data.reasonAdvance,
      ];
      this.changeWindow.will.first = [
        this.changeWindow.data.organizationFirst,
        this.changeWindow.data.branchFirst,
      ];
      this.changeWindow.will.second = [
        this.changeWindow.data.organizationSecond,
        this.changeWindow.data.branchSecond,
      ];
      this.changeWindow.major = [
        this.changeWindow.data.major,
        this.changeWindow.data.classNum,
      ];
      //开启窗口
      this.changeWindow.open = true;
    },
    changeSend() {
      //从级联选择器中取出数据
      [
        this.changeWindow.data.organizationAdvance,
        this.changeWindow.data.branchAdvance,
      ] = this.changeWindow.will.advance;
      [
        this.changeWindow.data.organizationFirst,
        this.changeWindow.data.branchFirst,
      ] = this.changeWindow.will.first;
      [
        this.changeWindow.data.organizationSecond,
        this.changeWindow.data.branchSecond,
      ] = this.changeWindow.will.second;
      [this.changeWindow.data.major, this.changeWindow.data.classNum] =
        this.changeWindow.major;
      //前端发送超级管理员身份确认
      this.changeWindow.data.authority = "super";
      //token注入
      this.changeWindow.data.userToken = sessionStorage.getItem("userToken");
      this.changeWindow.data.userId = sessionStorage.getItem("userId");
      //发送数据更新请求
      this.axios
        .post(config.serverAddress + "/changeAll", this.changeWindow.data)
        .then((res) => {
          if (res.data.status && res.data.content == undefined) {
            this.$Message.success("提交成功!");
          } else {
            this.$Message.warning(res.data.content);
          }
          //关闭修改窗口
          this.changeWindow.open = false;
          this.loadingShow = true;
          //重新加载数据
          this.seeExcel(() => {
            setTimeout(() => {
              this.loadingShow = false;
            }, 500);
          });
        });
    },
    //取消修改窗口
    changeCancel() {
      this.$Message.warning("取消修改!");
      this.changeWindow.open = false;
    },
    //检查权限
    authoritycheck() {
      //获取当前管理员账号
      let userId = sessionStorage.getItem("userId");
      //请求管理员权限
      this.axios
        .post(config.serverAddress + "/authority", { userId })
        .then((res) => {
          if (res.data.authority === "super") {
            this.isNormal = false;
          } else {
            this.isNormal = true;
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    //导出excel表格
    getExcel() {
      require.ensure([], () => {
        const { export_json_to_excel } = require("../../config/Export2Excel");
        const tHeader = [
          "学号",
          "姓名",
          "专业",
          "班级",
          "qq号",
          "手机号",
          "提前批组织",
          "提前批部门",
          "提前批原因",
          "一志愿组织",
          "一志愿部门",
          "一志愿原因",
          "二志愿组织",
          "二志愿部门",
          "二志愿原因",
          "是否调剂",
        ];
        const filterVal = [
          "stdId",
          "stdName",
          "major",
          "classNum",
          "stdQQ",
          "stdPhone",
          "organizationAdvance",
          "branchAdvance",
          "reasonAdvance",
          "organizationFirst",
          "branchFirst",
          "reasonFirst",
          "organizationSecond",
          "branchSecond",
          "reasonSecond",
          "isDispensing",
        ];
        const list = this.allData;
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "SCSE组织报名系统详情");
      });
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },
  },
  components: {
    "zy-loading": loading,
  },
  computed: {
    //规定显示的列
    giveColumns() {
      return config.tableColumns;
    },
  },
};
</script>

<style lang="scss" scoped>
.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  min-height: 100vh;
}
.layout-logo {
  width: 100px;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  float: left;
  position: relative;
  top: 15px;
  left: 20px;
  color: white;
  line-height: 30px;
  text-align: center;
  font-size: 20px;
  letter-spacing: 5px;
}
.layout-nav {
  width: 420px;
  margin: 0 auto;
}
.layout-content {
  width: 1400px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50px;
  text-align: center;
  margin-top: 40px;
  background-color: #fff;
  .index-content {
    width: 100%;
    background-image: url("../../assets/indexBg.jpg");
    background-size: cover;
    height: 600px;
    position: relative;
    .title {
      font-size: 40px;
      color: white;
      text-align: start;
      animation: anm1 0.8s linear;
      margin-left: 40px;
      padding-top: 30px;
    }
    .content {
      text-align: start;
      font-size: 16px;
      color: white;
      margin-left: 20px;
    }
  }
  @keyframes anm1 {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  .layout-page {
    margin-top: 20px;
    margin-bottom: 20px;
  }
  padding-bottom: 1px;
}
.layout-copy {
  text-align: center;
  position: absolute;
  padding: 10px 0 20px;
  color: #9ea7b4;
  bottom: 0;
  left: 0;
  right: 0;
}
.body {
  animation: anm1 0.3s ease-in;
  @keyframes anm1 {
    0% {
      width: 100%;
      height: 100%;
      opacity: 0;
      transform: scale(0.98);
    }
    100% {
      width: 100%;
      height: 100%;
      opacity: 1;
      transform: scale(1);
    }
  }
}
.ivu-modal {
  .content {
    margin-top: 10px;
    text-align: center;
    font-size: 16px;
  }
  .select {
    margin-top: 10px;
  }
  .secondRow {
    text-align: center;
    margin-top: 20px;
  }
  .firstRow {
    text-align: center;
    margin-bottom: 10px;
  }
  .ivu-switch {
    display: block;
    margin: 0 auto;
  }
}
</style>
