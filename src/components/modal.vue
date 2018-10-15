<template>
  <div class="modal">
    <Modal
      v-model="isShow"
      title=""
      @on-ok="ok"
      @on-cancel="cancel">
      <ul class="modal-content">
        <li v-for="(item, index) in data" :key="index">
          <div>
            <span style="min-width: 60px;display: inline-block">{{item.text}}:</span>
            <span style="color: #2d8cf0; font-weight: bold">{{item.value}}</span>
          </div>
        </li>
      </ul>
    </Modal>
  </div>

</template>
<script>
  export default {
    props: {
      data: {
        type: Array,
        default: () => {}
      },
      title: {
        type: String,
        default: '确认'
      }
    },
    data () {
      return {
        isShow: false
      }
    },
    methods: {
      show () {
        this.isShow = true
      },
      ok () {
        this.$emit('click', this.data)
      },
      cancel () {
//        this.$Message.info('Clicked cancel')
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss">
  .modal {
    .modal-content {
      background: red;
      .title {
        min-width: 100px;
      }
      .content {
        font-weight: bold;
        color: #2d8cf0;
      }
    }
  }

</style>
