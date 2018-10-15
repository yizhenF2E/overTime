<!--请假-->
<template>
  <div class="record">
    <div class="record-info">

      <div class="operation">
        <Button type="primary" ghost @click="exportDate">导出数据</Button>
        <div class="admin-operation" v-if="this.loginInfo.nickname === 'admin'">
          <Input type="text" v-model="query.name" placeholder="请输入查询人" style="width: 150px"></Input>
          <div @click="showDateTime('queryStart')">
            <Input type="text" v-model="query.start" placeholder="输入查询开始日期"></Input>
          </div>
          <div @click="showDateTime('queryEnd')">
            <Input type="text" v-model="query.end" placeholder="输入查询开始日期"></Input>
          </div>

          <Button type="primary" ghost @click="requestQuery">提交数据</Button>
        </div>
      </div>
      <!--说明-->
      <div class="record-text" v-if="this.loginInfo.nickname !== 'admin'">
        调休说明：调休请备注加班的日期！加班产生的<span>三月内调休有效!!!</span>过期作废哦！</br>
        调休说明：凑够<span>8小时</span>调休一天，凑够<span>4小时</span>调休半天</br>
        调休备注：调休请<span>务必备注加班日子</span>，格式 2018-09-15(2h) | 2018-09-16(2h)</br>
        请假说明：请假的最小单位为<span>4.5小时</span>,说的简单点就是一个上午或者一个下午</br>
        半天请假：上午时间 <span>9：30 ~ 14：00</span>，下午是<span>14：00 ~ 18：30</span></br>
        请假流程：<span>邮件方式告知部门小组长 -[组长同意]-> 组长转发邮件给部门领导 -[部门同意]-> 发送邮件给请假人</span></br>
        可用年假：您的入职时间是<span>{{joinTime}}</span>，可用<span>{{annualLeave}}</span>天,年假只能在试用期过后使用, 时间仅供参考。
      </div>
    </div>
    <!--用户的输入操作-->
    <div class="record-input" v-if="this.loginInfo.nickname !== 'admin'">
      <Form ref="record" :model="record" :rules="ruleValidate" inline>
        <FormItem prop="dateStart">
          <div @click="showDateTime('start')">
            <Input type="text" v-model="record.dateStart" placeholder="请输入起始请假时间"></Input>
          </div>
        </FormItem>
        <FormItem prop="dateEnd">
          <div @click="showDateTime('end')">
            <Input type="text" v-model="record.dateEnd" placeholder="请输入结束请假的时间"></Input>
          </div>
        </FormItem>
        <FormItem prop="type">
          <Select v-model="record.type" placeholder="请选择请假类型">
            <Option value="调休">调休</Option>
            <Option value="年假">年假</Option>
            <Option value="事假">事假</Option>
            <Option value="病假">病假</Option>
            <Option value="丧假">丧假</Option>
            <Option value="婚假">婚假</Option>
            <Option value="陪产假">陪产假</Option>
            <Option value="流产假">流产假</Option>
            <Option value="孕检假">孕检假</Option>
            <Option value="产假">产假</Option>
          </Select>
        </FormItem>
        <FormItem prop="remark">
          <Input type="text" v-model="record.remark" placeholder="备注"></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" ghost @click="send('record')">提交数据</Button>
        </FormItem>
      </Form>
    </div>
    <!--表格-->
    <div class="table-content">
      <div class="table-page">
        <Page :total="count" :page-size="100" @on-change="requestQuery"/>
      </div>
      <Table width="100%" border :columns="columns" :data="list" ref="table"></Table>
    </div>

    <date-time ref="start"
               color="#2d8cf0"
               format="yyyy-MM-dd hh:mm"
               @confirm="selectStar"></date-time>

    <date-time ref="end"
               color="#2d8cf0"
               format="yyyy-MM-dd hh:mm"
               @confirm="selectEnd"></date-time>

    <date-time ref="queryStart"
               color="#2d8cf0"
               type="date"
               format="yyyy-MM-dd"
               @confirm="queryStart"></date-time>

    <date-time ref="queryEnd"
               color="#2d8cf0"
               type="date"
               format="yyyy-MM-dd"
               @confirm="queryEnd"></date-time>

    <modal title="确认加班信息" :data="modalData" ref="send" @click="requestSendDate"></modal>
  </div>

</template>

<script>
  import {mapGetters} from 'vuex'
  import DateTime from 'vue-date-time-m'
  import Modal from '@/components/modal'
  import time from '@/common/time'

  export default {
    name: 'record',
    data () {
      return {
        // 渲染的数据
        list: [],
        tmp: {}, // 缓存
        // 提交的数据
        record: {},
        ruleValidate: {
          fare: [{required: true, message: '必填项', trigger: 'blur'}],
          mealFee: [{required: true, message: '必填项', trigger: 'blur'}]
        },
        // table的配置
        columns: [
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '部门',
            key: 'department',
            width: 150,
            align: 'center'
          },
          {
            title: '姓名',
            key: 'name',
            width: 100,
            align: 'center'
          },
          {
            title: '请假开始',
            key: 'dateStart',
            width: 150,
            align: 'center'
          },
          {
            title: '请假结束',
            key: 'dateEnd',
            width: 150,
            align: 'center'
          },
          {
            title: '请假类型',
            key: 'type',
            width: 100,
            align: 'center'
          },
          {
            title: '天数',
            key: 'time',
            width: 100,
            align: 'center'
          },
          {
            title: '周几',
            key: 'week',
            width: 100,
            align: 'center'
          },
          {
            title: '备注',
            key: 'remark',
            width: 200,
            align: 'center'
          },
          {
            title: '操作',
            key: 'action',
            width: 120,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.requestRemove(params)
                    }
                  }
                }, '删除')
              ])
            }
          }
        ],
        // 管理员查询
        query: {
          start: '',
          end: '',
          name: ''
        },
        count: 0, // 数据总数
        page: 1, // 页码
        skip: 0 // 跳过多少数据
      }
    },
    computed: {
      ...mapGetters([
        'loginInfo'
      ]),
      joinTime () {
        return time.format(new Date(this.loginInfo.entryTime), 'yyyy-MM-dd')
      },
      modalData () {
        let week = ['日', '一', '二', '三', '四', '五', '六']
        let arr = [
          {
            text: '部门',
            value: this.loginInfo.department
          },
          {
            text: '姓名',
            value: this.loginInfo.username
          },
          {
            text: '请假天数',
            value: this.record.time + '天'
          },
          {
            text: '请假起始',
            value: this.record.dateStart
          },
          {
            text: '请假结束',
            value: this.record.dateEnd
          },
          {
            text: '周几',
            value: `周${week[this.record.week]}`
          },
          {
            text: '请假类型',
            value: this.record.type
          },
          {
            text: '备注',
            value: this.record.remark
          }
        ]
        return arr
      },
      pageNum () {
        if (this.loginInfo.nickname === 'admin') {
          return 200
        }
        return 100
      },
      annualLeave () {
        let enterYear = new Date(this.loginInfo.entryTime).getFullYear()
        let nowYear = new Date().getFullYear()
        let holiday
        // to do
        if (nowYear === enterYear) {
          return (this.diffDay(this.loginInfo.entryTime) / 365 * 5).toFixed(2)
        } else {
          if (nowYear - enterYear >= 20) {
            holiday = 15
          } else if (nowYear - enterYear >= 5) {
            holiday = 10
          } else if (nowYear - enterYear >= 1) {
            holiday = 5
          }
          return (this.diffDay(`${nowYear}-1-1`) / 365 * holiday).toFixed(2)
        }
      }
    },
    components: {
      DateTime,
      Modal
    },
    created () {
      this.init()
      this.requestQuery(1)
    },
    methods: {
      init () {
        this.record = {
          name: '',
          department: '',
          dateStart: '',
          dateEnd: '',
          time: '',
          type: '',
          remark: '',
          week: 0
        }
      },
      diffDay (date) {
        if (date) {
          let enter = new Date(date)
          let now = new Date()
          return (now - enter) / (1000 * 60 * 60 * 24)
        }
      },
      // 查询
      requestQuery (page) {
        let query = new this.$AV.Query('record2018')
        if (page) {
          query = query.skip((page - 1) * this.pageNum)
        }
        if (this.query.start || this.query.end) {
          let min = new Date(this.query.start).getTime()
          let max = new Date(this.query.end).getTime()
          min && query.greaterThanOrEqualTo('dateStart', min)
          max && query.lessThanOrEqualTo('dateEnd', max)
        }
        if (this.query.name) {
          query.equalTo('name', this.query.name)
        }
        if (this.loginInfo.username !== '管理员') {
          query.equalTo('name', this.loginInfo.username)
        }
        query.find().then((response) => {
          this.list = this.transformData(response)
          console.log(response)
        })
        query.count().then((response) => {
          this.count = response
        })
      },
      edit (val) {
        console.log(val)
      },
      // 删除数据
      requestRemove (val) {
        let dataBase = this.$AV.Object.createWithoutData('record2018', this.list[val.index].id.toString())
        console.log(dataBase)
        dataBase.destroy().then((success) => {
          this.list.splice(val.index, 1)
          this.$Message.success('成功')
        })
      },
      // 保存数据
      requestSendDate () {
        let Data = this.$AV.Object.extend('record2018')
        let week = ['日', '一', '二', '三', '四', '五', '六']
        let dataBase = new Data()
        this.record.dateStart = new Date(this.safariDate(this.record.dateStart)).getTime()
        this.record.dateEnd = new Date(this.safariDate(this.record.dateEnd)).getTime()
        this.record.id = ''
        this.tmp = Object.assign({}, this.record)
        for (let key in this.record) {
          dataBase.set(key, this.record[key])
        }
        this.init()
        dataBase.save().then((response) => {
          if (response.id) {
            // location.reload()
            this.$Message.success('成功')
            let obj = Object.assign({}, this.tmp, {id: response.id})
            obj.dateStart = time.format(new Date(obj.dateStart), 'yyyy-MM-dd hh: mm')
            obj.dateEnd = time.format(new Date(obj.dateEnd), 'yyyy-MM-dd hh: mm')
            obj.week = `周${week[obj.week]}`
            obj.time = obj.time + '天'
            this.list.push(obj)
          }
        })
      },
      // 拿到的数据格式化
      transformData (data) {
        let array = []
        let week = ['日', '一', '二', '三', '四', '五', '六']
        data.map(item => {
          item.attributes.id = item.id
          item.attributes.dateStart = time.format(new Date(item.attributes.dateStart), 'yyyy-MM-dd hh:mm')
          item.attributes.dateEnd = time.format(new Date(item.attributes.dateEnd), 'yyyy-MM-dd hh:mm')
          item.attributes.time = item.attributes.time + '天'
          item.attributes.week = `周${week[item.attributes.week]}`
          array.push(item.attributes)
        })
        return array
      },
      reset (obj) {
        for (let key in obj) {
          obj[key] = ''
        }
        return obj
      },
      send (name) {
        this.$refs[name].validate((valid) => {
          if (valid && this.record.dateStart && this.record.dateEnd && this.record.type) {
            this.record.week = parseInt(new Date(this.safariDate(this.record.dateStart)).getDay(), 10)
            this.record.time = this.diff(this.record.dateStart, this.record.dateEnd)
            this.record.name = this.loginInfo.username
            this.record.department = this.loginInfo.department
            if (this.record.time > 0) {
              this.$refs.send.show()
            } else {
              this.$Message.error('请假时间有误')
            }
          } else {
            this.$Message.error('有没有填写的数据')
          }
        })
      },
      diff (start, end) {
        let diff = new Date(this.safariDate(end)).getTime() - new Date(this.safariDate(start)).getTime()

        let minutes = Math.floor(diff / (60 * 1000))
        if (minutes > 0) {
          let hour = (minutes / 60).toFixed(1)
          if (hour <= 9) {
            return (hour / 9).toFixed(1)
          } else {
            let remain = hour % 24
            let day = parseInt(hour / 24, 10)
            if (remain <= 9 && remain > 0) {
              return parseFloat((remain / 9).toFixed(1)) + day
            } else {
              return day
            }
          }
        } else {
          return 0
        }
      },
      safariDate (date) {
        return date.replace(/\s/g, 'T').replace(/\//g, '-')
      },
      queryStart (val) {
        this.query.start = val
      },
      queryEnd (val) {
        this.query.end = val
      },
      selectStar (val) {
        this.record.dateStart = val
      },
      selectEnd (val) {
        this.record.dateEnd = val
      },
      showDateTime (type) {
        this.$refs[type].show()
      },

      // 导出数据
      exportDate () {
        this.$refs.table.exportCsv({
          filename: '请假记录'
        })
      }
    }

  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .record {
    padding: 16px;
    .record-info {
      font-size: 12px;
      line-height: 1.4;
      .operation {
        display: flex;
        margin-bottom: 16px;
        .admin-operation {
          display: flex;
          margin-left: 20px;
          > div + div {
            margin: 0 10px 0 10px;
          }
        }
      }
      .record-text {
        margin-bottom: 16px;
        span {
          color: #2b85e4;
          font-weight: bold;
        }
      }
    }
    .table-content {
      .table-page {
        margin-bottom: 10px;
      }
    }
  }
</style>
