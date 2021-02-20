export default {
  pages: [
    'pages/index/index',
    'pages/info/info',
    'pages/roleTable/roleTable',
    'pages/addBattle/addBattle',
    'pages/historySearch/historySearch',
    'pages/about/about'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar:{
    list:[
      {
        "pagePath":'pages/index/index',
        "text": "首页"
      },
      { 
        "pagePath": 'pages/info/info',
        "text":"我的"
      }
    ],
    position:"bottom"
  }
  
}
