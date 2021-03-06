const moment = require('moment')
const schedule = require('node-schedule')
const axios = require('axios')

const Echojs = require('./rss/echojs')

// TODO: 记录 RSS 上次数据，做去重处理

moment.locale('zh-cn')

// const webhook = 'https://oapi.dingtalk.com/robot/send?access_token=684025a2c2f80e9d7716baace939f91f1adfb444e967113501f66babfe153d02'
const webhook = 'https://oapi.dingtalk.com/robot/send?access_token=7cbfc510719d62a9fe0d2fb96669e026b7568449c70c4a2d1335b024c850c2bd'

function sendDD (news) {
  if (!news) {
    console.log('没有获取到新闻')
    return
  }
  const dingdingText = news.items.map(x => {
    const { title, guid } = x
    return `- [${title}](${guid})`
  }).join('\n')

  axios.post(webhook, {
    'msgtype': 'markdown',
    'markdown': {'title': '前端资讯',
      'text': `## 前端资讯(BETA) \n ##### ${moment().format('LL')} \n\n ${dingdingText}\n\n`
    },
    'at': {
      'atMobiles': [],
      'isAtAll': false
    }
  }).then(() => console.log('发送成功！')).catch(err => {
    console.log(err)
  })

}

function getNews () {
  const echojs = new Echojs()
  echojs.getRssJson().then(res => {
    sendDD(res)
  })
}

// 定时任务
// schedule.scheduleJob('* * 9 * * *', function () {
//   getNews()
// })
getNews()
