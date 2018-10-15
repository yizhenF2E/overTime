<!--登录-->
<template>
  <div class="login">
    <Form ref="loginForm" :model="login" :rules="ruleValidate" inline>
      <FormItem prop="user">
        <Input type="text" v-model="login.user" placeholder="请输入昵称">
        <Icon type="ios-person-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem prop="password">
        <Input type="password" v-model="login.password" placeholder="请输入密码" @on-enter="loginFn('loginForm')">
        <Icon type="ios-locked-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="loginFn('loginForm')">登录</Button>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="signIn">注册</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    name: 'login',
    data () {
      return {
        login: {
          user: '',
          password: ''
        },
        ruleValidate: {
          user: [
            {required: true, message: '请填写用户名', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请填写密码', trigger: 'blur'},
            {type: 'string', min: 6, message: '密码至少6位', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      loginFn (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.requestLogin()
          } else {
            this.$Message.error('Fail!')
          }
        })
      },
      /**
       * 登录
       */
      requestLogin () {
        let query = new this.$AV.Query('user')
        query.equalTo('nickname', this.login.user)
        query.equalTo('password', this.login.password)
        query.find().then((response) => {
          if (response.length !== 0) {
          let obj = Object.assign({}, response[0].attributes, {id: response[0].id})
          this.saveLoginInfoAction(obj)
          this.$Message.success('Success!')
          this.$router.push({name: 'home'})
          } else {
          this.$Message.error('还没有注册吧或者密码输入错误了')
        }
      })
      },
      signIn () {
        this.$router.push({name: 'signIn'})
      },
      ...mapActions([
        'saveLoginInfoAction'
      ])
    },
    components: {}
  }
</script>

<style scoped>
  .login {
    text-align: center;
    margin-top: 50px;
  }
</style>
