<template>
  <div class="home">
    欢迎 {{loginInfo.nickname}}！
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    name: 'home',
    data () {
      return {
      }
    },
    created () {
      console.log(this.loginInfo)
    },
    computed: {
      ...mapGetters([
        'loginInfo'
      ])
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
  .home {
    padding: 16px;
  }

</style>
