<template>
  <div class="main">
    <nav>
      <div class="logo">互联网研发</div>
      <ul>
        <router-link tag="li" :to="{name: 'home'}">我的主页</router-link>

        <router-link tag="li" :to="{name: 'record'}">我的请假</router-link>
        <router-link tag="li" :to="{name: 'overTime'}">我的加班</router-link>
        <li @click="exit">退出登录</li>
      </ul>
    </nav>

    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import {mapActions} from 'vuex'

  export default {
    name: 'main',
    methods: {
      ...mapActions([
        'clearLoginInfoAction'
      ]),
      exit () {
        this.clearLoginInfoAction()
        this.$router.replace({name: 'login'})
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
  .main {
    display: flex;
    nav {
      background: #f8f9fa;
      width: 15vw;
      border-right: 1px solid #efefef;
      height: 100vh;
      .logo {
        text-align: center;
        font-size: 20px;
        padding: 16px 0;
        background: white;
      }
      .router-link-exact-active {
        background: #2d8cf0;
        color: white;
        font-weight: bold;
      }
      li {
        text-align: center;
        padding: 16px 0;
        border-top: 1px solid #efefef;
        font-size: 14px;
        cursor: pointer;
      }
    }

    .content {
      width: 85vw;
    }

  }

</style>
