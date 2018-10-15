<!--加班-->
<template>
  <div class="overtime">
    <div class="overtime-info">

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
      <div class="overtime-text" v-if="this.loginInfo.nickname !== 'admin'">
        打车说明：打车请保留<span>打车票据</span>, <span>滴滴快车请打印电子发票</span>和<span>行程单</span>。</br>
        餐费说明：工作日和非工作日超过6个小时，餐费40, 正常20。</br>
        提交票据：请写明<span>加班日期</span>和<span>加班人</span>, <span>最好票据用胶水粘贴好给我</span>。</br>
        填写时间：每次填写加班时间以<span>30分钟</span>为单位，填写时间应为0.5h, 1.5h ..</br>
      </div>
    </div>
    <!--用户的输入操作-->
    <div class="overtime-input" v-if="this.loginInfo.nickname !== 'admin'">
      <Form ref="overTime" :model="overTime" :rules="ruleValidate" inline>
        <FormItem prop="dateStart">
          <div @click="showDateTime('start')">
            <Input type="text" v-model="overTime.dateStart" placeholder="请输入起始加班"></Input>
          </div>
        </FormItem>
        <FormItem prop="dateEnd">
          <div @click="showDateTime('end')">
            <Input type="text" v-model="overTime.dateEnd" placeholder="请输入结束加班"></Input>
          </div>
        </FormItem>
        <FormItem prop="fare">
          <InputNumber type="text" v-model="overTime.fare" placeholder="请输入交通费" :min="0"></InputNumber>
        </FormItem>
        <FormItem prop="mealFee">
          <Select v-model="overTime.mealFee" placeholder="选择餐补">
            <Option value="20">20元</Option>
            <Option value="40">40元</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary" ghost @click="send('overTime')">提交数据</Button>
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
               format="yyyy-MM-dd hh:mm"
               @confirm="queryStart"></date-time>

    <date-time ref="queryEnd"
               color="#2d8cf0"
               type="date"
               :value="overTime.dateStart"
               format="yyyy-MM-dd hh:mm"
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
    name: 'overTime',
    data () {
      return {
        // 渲染的数据
        tmp: {},
        list: [],
        // 提交的数据
        overTime: {},
        ruleValidate: {
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
            title: '加班开始',
            key: 'dateStart',
            width: 150,
            align: 'center'
          },
          {
            title: '加班结束',
            key: 'dateEnd',
            width: 150,
            align: 'center'
          },
          {
            title: '周几',
            key: 'week',
            width: 100,
            align: 'center'
          },
          {
            title: '时长',
            key: 'time',
            width: 100,
            align: 'center'
          },
          {
            title: '交通费',
            key: 'fare',
            width: 100,
            align: 'center'
          },
          {
            title: '餐补',
            key: 'mealFee',
            width: 100,
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
            text: '加班时长',
            value: this.overTime.time + '小时'
          },
          {
            text: '加班起始',
            value: this.overTime.dateStart
          },
          {
            text: '加班结束',
            value: this.overTime.dateEnd
          },
          {
            text: '交通费',
            value: this.overTime.fare + '元'
          },
          {
            text: '餐补',
            value: this.overTime.mealFee + '元'
          },
          {
            text: '周几',
            value: `周${week[this.overTime.week]}`
          }
        ]
        return arr
      },
      pageNum () {
        if (this.loginInfo.nickname === 'admin') {
          return 200
        }
        return 100
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
      // 查询
      requestQuery (page) {
        let query = new this.$AV.Query('overTime2018')
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
        })
        query.count().then((response) => {
          this.count = response
        })
      },
      // 删除数据
      requestRemove (val) {
        let dataBase = this.$AV.Object.createWithoutData('overTime2018', this.list[val.index].id)
        dataBase.destroy().then((success) => {
          this.list.splice(val.index, 1)
          this.$Message.success('成功')
        })
      },
      // 保存数据
      requestSendDate () {
        let Data = this.$AV.Object.extend('overTime2018')
        let week = ['日', '一', '二', '三', '四', '五', '六']
        let dataBase = new Data()
        this.overTime.mealFee = parseInt(this.overTime.mealFee, 10)
        this.overTime.dateStart = new Date(this.safariDate(this.overTime.dateStart)).getTime()
        this.overTime.dateEnd = new Date(this.safariDate(this.overTime.dateEnd)).getTime()
        this.overTime.id = ''
        this.tmp = Object.assign({}, this.overTime)
        for (let key in this.overTime) {
          dataBase.set(key, this.overTime[key])
        }
        this.init()
        dataBase.save().then((response) => {
          if (response.id) {
            this.$Message.success('成功')
            let obj = Object.assign({}, this.tmp, {id: response.id})
            console.log(this.overTime.dateStart)
            obj.dateStart = time.format(new Date(obj.dateStart), 'yyyy-MM-dd hh: mm')
            obj.dateEnd = time.format(new Date(obj.dateEnd), 'yyyy-MM-dd hh: mm')
            obj.week = `周${week[obj.week]}`
            obj.time = obj.time + 'h'
            obj.mealFee = obj.mealFee + '元'
            obj.fare = obj.fare + '元'
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
          item.attributes.week = `周${week[item.attributes.week]}`
          item.attributes.time = item.attributes.time + 'h'
          item.attributes.mealFee = item.attributes.mealFee + '元'
          item.attributes.fare = item.attributes.fare + '元'
          array.push(item.attributes)
        })
        return array
      },
      init () {
        this.overTime = {
          department: '',
          dateStart: '',
          dateEnd: '',
          fare: 0,
          mealFee: 0,
          time: 0,
          week: 0,
          name: ''
        }
      },
      send (name) {
        this.$refs[name].validate((valid) => {
          if (valid && this.overTime.dateStart && this.overTime.dateEnd) {
            this.overTime.week = parseInt(new Date(this.safariDate(this.overTime.dateStart)).getDay(), 10)
            this.overTime.time = parseFloat(this.diff(this.overTime.dateStart, this.overTime.dateEnd))
            this.overTime.name = this.loginInfo.username
            this.overTime.department = this.loginInfo.department
            if (this.overTime.time > 0) {
              this.$refs.send.show()
            } else {
              this.$Message.error('加班时间有误')
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
          return (minutes / 60).toFixed(1)
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
        this.overTime.dateStart = val
      },
      selectEnd (val) {
        this.overTime.dateEnd = val
      },
      showDateTime (type) {
        this.$refs[type].show()
      },

      // 导出数据
      exportDate () {
        this.$refs.table.exportCsv({
          filename: '加班记录'
        })
      }
    }

  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .overtime {
    padding: 16px;
    .overtime-info {
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
      .overtime-text {
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
