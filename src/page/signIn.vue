<!--注册-->
<template>
  <div class="signIn">
    <Form ref="signIn" :model="signIn" :rules="ruleValidate" :label-width="80">
      <FormItem prop="nick">
        <Input type="text" v-model="signIn.nick" placeholder="昵称">
        <Icon type="ios-heart-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <!--用户名-->
      <FormItem prop="user">
        <Input type="text" v-model="signIn.user" placeholder="请使用真实姓名，否则无法获取之前的加班数据">
        <Icon type="ios-person-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <!--密码-->
      <FormItem prop="password">
        <Input type="password" v-model="signIn.password" placeholder="密码">
        <Icon type="ios-locked-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <!--重复密码-->
      <FormItem prop="passwordRepeat">
        <Input type="password" v-model="signIn.passwordRepeat" placeholder="再输入一次">
        <Icon type="ios-locked-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <!--手机号-->
      <FormItem prop="telephone">
        <Input type="text" v-model="signIn.telephone" placeholder="请输入电话">
        <Icon type="ios-telephone-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <!--入职时间-->
      <FormItem>
        <div @click="showDateTime('date')">
          <Input type="text" v-model="signIn.date" placeholder="请输入入职时间">
          <Icon type="ios-time-outline" slot="prepend"></Icon>
          </Input>
        </div>
      </FormItem>
      <!--部门-->
      <FormItem prop="department">
        <Select v-model="signIn.department" placeholder="请选择部门">
          <Option value="互联网研发">互联网研发</Option>
        </Select>
      </FormItem>

      <FormItem>
        <Button type="primary" @click="send('signIn')">注册</Button>
        <Button type="ghost" style="margin-left: 8px">取消</Button>
      </FormItem>
    </Form>

    <date-time ref="date"
               color="#2d8cf0"
               type="date"
               format="yyyy-MM-dd"
               @confirm="signInDate"></date-time>
  </div>
</template>

<script>
  import DateTime from 'vue-date-time-m'

  export default {
    name: 'signIn',
    data () {
      const repeatCheck = (rule, value, callback) => {
        if (this.signIn.password !== value) {
          callback(new Error('两次密码不一样亲'))
        } else {
          callback()
        }
      }
      const telephoneCheck = (rule, value, callback) => {
        if (value.length !== 11) {
          callback(new Error('电话是11位吧亲'))
        } else if (isNaN(value)) {
          callback(new Error('请输入数字'))
        } else {
          callback()
        }
      }
      const userCheck = (rule, value, callback) => {
        let reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/
        if (!reg.test(value)) {
          callback(new Error('请输入中文！'))
        } else {
          callback()
        }
      }
      return {
        signIn: {
          nick: '',
          user: '',
          password: '',
          passwordRepeat: '',
          telephone: '',
          date: '',
          department: ''
        },
        ruleValidate: {
          nick: [
            {required: true, message: '来个人见人爱的昵称吧', trigger: 'blur'}
          ],
          user: [
            {required: true, message: '填写你的真实姓名', trigger: 'blur'},
            {validator: userCheck, trigger: 'blur'}
          ],
          password: [
            {required: true, message: '填写你的密码', trigger: 'blur'},
            {type: 'string', min: 6, message: '不小于6位', trigger: 'blur'}
          ],
          passwordRepeat: [
            {required: true, message: '重复填写你的密码', trigger: 'blur'},
            {type: 'string', min: 6, message: '不小于6位', trigger: 'blur'},
            {validator: repeatCheck, trigger: 'blur'}
          ],
          telephone: [
            {required: true, message: '填写你的电话号码', trigger: 'blur'},
            {validator: telephoneCheck, trigger: 'blur'}
          ]
        }
      }
    },
    components: {
      DateTime
    },
    methods: {
      signInDate (val) {
        this.signIn.date = val
      },
      showDateTime (type) {
        this.$refs[type].show()
      },
      send (name) {
        this.$refs[name].validate((valid) => {
          if (valid && this.signIn.date && this.signIn.department) {
            this.requestCheckNickName()
          } else {
            this.$Message.error('注册的内容都是必填项亲[微笑]')
          }
        })
      },
      /**
       * 注册
       */
      requestSendSignIn () {
        let Data = this.$AV.Object.extend('user')
        let dataBase = new Data()
        dataBase.set('nickname', this.signIn.nick)
        dataBase.set('username', this.signIn.user)
        dataBase.set('password', this.signIn.password)
        dataBase.set('telephone', this.signIn.telephone)
        dataBase.set('entryTime', new Date(this.signIn.date).getTime())
        dataBase.set('department', this.signIn.department)

        dataBase.save().then((response) => {
          if (response) {
            this.$Message.success('注册成功')
            this.$router.push({name: 'login'})
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      /**
       * 检查昵称
       */
      requestCheckNickName () {
        let query = new this.$AV.Query('user')
        query.equalTo('nickname', this.signIn.nick)
        query.find().then((response) => {
          if (response.length === 0) {
            this.requestSendSignIn()
          } else {
            this.$Message.error('昵称已经注册过了')
            this.signIn.nick = ''
          }
        })
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .signIn {
    width: 80vw;
  }
</style>
