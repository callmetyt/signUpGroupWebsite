<template>
  <div id="timeCheckUp">
    <div class="timeClock">
      <img class="animate__animated" src="../assets/sipc.png" />
      <header>系统关闭时间：2020-09-29 12:00</header>
      <div class="countUp">距离关闭还有：{{ time }}</div>
    </div>
    <div class="demo-spin-container" v-show="loadingShow">
      <h1>！系统已关闭！</h1>
    </div>
  </div>
</template>

<script>
export default {
  name: "timeCheckUp",
  data() {
    return {
      loadingShow: false,
      endTime: new Date("2020/09/29 12:00").getTime(),
      time: "",
    };
  },
  components: {},
  mounted() {
    this.time = this.timeTransfrom(this.endTime - Date.now());
    setInterval(() => {
      this.time = this.timeTransfrom(this.endTime - Date.now());
    }, 1000);
  },
  methods: {
    timeTransfrom(time) {
      if (time <= 0) {
        this.loadingShow = true;
      }
      let days = Math.floor(time / (24 * 3600 * 1000));
      let tmp = time % (24 * 3600 * 1000);
      let hours = Math.floor(tmp / (3600 * 1000));
      tmp = tmp % (3600 * 1000);
      let minutes = Math.floor(tmp / (60 * 1000));
      tmp = tmp % (60 * 1000);
      let seconds = Math.round(tmp / 1000);
      return `${days}天 ${hours}小时${minutes}分钟${seconds}秒`;
    },
  },
};
</script>

<style scoped lang="scss">
#timeCheckUp {
  .timeClock {
    margin-top: 20px;
    width: 380px;
    color: rgb(64, 68, 78);
    font-size: 16px;
    position: absolute;
    z-index: 1;
    left: 50%;
    transform: translateX(-50%);
    border: 0.1px solid rgb(232, 234, 236);
    border-radius: 20px;
    padding: 20px;
    background-color: #fff;
    opacity: 0.8;
    img {
      width: 100px;
      display: block;
      margin: 0 auto;
      margin-bottom: 10px;
    }
    img:hover {
      animation: swing;
      animation-duration: 1.5s;
    }
    header {
      text-align: center;
    }
    .countUp {
      text-align: center;
    }
  }
  .timeClock:hover {
    box-shadow: 0 0 2px 0.5px rgb(233, 233, 233);
  }
  .demo-spin-container {
    position: fixed;
    width: 100%;
    height: 100vh;
    z-index: 999;
    background-color: #666;
    opacity: 0.9;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 48px;
  }
}
</style>
