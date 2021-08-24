<template>
  <div id="timeCheck">
    <div class="demo-spin-container" v-show="loadingShow">
      <div class="timeClock">
        <header>系统开放时间：2020-09-21 17:00</header>
        <div class="countDown">距离开放还有：{{ time }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "timeCheck",
  data() {
    return {
      loadingShow: true,
      startTime: new Date("2020/09/21 17:00").getTime(),
      time: ""
    };
  },
  components: {},
  methods: {
    timeTransfrom(time) {
      if (time <= 0) {
        this.loadingShow = false;
      }
      let days = Math.floor(time / (24 * 3600 * 1000));
      let tmp = time % (24 * 3600 * 1000);
      let hours = Math.floor(tmp / (3600 * 1000));
      tmp = tmp % (3600 * 1000);
      let minutes = Math.floor(tmp / (60 * 1000));
      tmp = tmp % (60 * 1000);
      let seconds = Math.round(tmp / 1000);
      return `${days}天 ${hours}小时${minutes}分钟${seconds}秒`;
    }
  },
  mounted() {
    this.time = this.timeTransfrom(this.startTime - Date.now());
    setInterval(() => {
      this.time = this.timeTransfrom(this.startTime - Date.now());
    }, 1000);
  }
};
</script>

<style scoped lang="scss">
#timeCheck {
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
    .timeClock {
      height: 200px;
      width: 500px;
      color: white;
      font-size: 26px;
      header {
        text-align: center;
      }
      .countDown {
        text-align: center;
        padding-top: 20px;
      }
    }
  }
}
</style>
