var wx = require("nodejs-websocket");  
var port = 3000;
let userName = '';
var currentCount = 0;
//日期格式化
Date.prototype.Format = function (fmt) { //author: meizz 
  var o = {
      "M+": this.getMonth() + 1, //月份 
      "d+": this.getDate(), //日 
      "H+": this.getHours(), //小时 
      "m+": this.getMinutes(), //分 
      "s+": this.getSeconds(), //秒 
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
      "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
  if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
//服务端创建websocket
var server = wx.createServer(function (conn) {
    conn.on("text", function (str) { //接受客户端推送过来的消息
      let obj = JSON.parse(str);
      let mes = {};
      if (obj.hasOwnProperty('name')){   
        let id = new Date().getTime();
        user = obj.name;
        mes.name = obj.name;
        mes.tocken = id;   //设置 tocken
        conn.userName = obj.name;
        conn.tocken = id;
        mes.infrom = '欢迎'+ obj.name + '进入聊天室';
      }
      if (obj.hasOwnProperty('val')) {
        mes.val = obj.val;
        mes.user = obj.user;
        mes.date = new Date().Format("yyyy-MM-dd HH:mm:ss");
      }
      broadcast(JSON.stringify(mes));
    })
    conn.on("close", function (code, reason) {   //关闭时处理
        let mes = {};
        mes.tocken = conn.tocken;
        mes.leaveMessage = conn.userName + '离开了聊天室';
        broadcast(JSON.stringify(mes));
    })
    conn.on("error", function(err) {
      console.log('错误信息:'+ err)
    })
}).listen(port)

function broadcast(str) {
  //获取server下的每一个连接
  server.connections.forEach((conn) => {
    conn.sendText(str);   //发送到客户端
  })

}