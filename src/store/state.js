import {
  loadLoginInfo
} from '@/common/storage'

// 存储的数据
const state = {
  loginInfo: loadLoginInfo() // 登陆信息，从localStorage取值
}

export default state
