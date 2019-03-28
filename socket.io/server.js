var app = require("http").createServer();  
var io = require('socket.io')(app);

var port = 3000;
let userName = '';
app.listen(port);
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
//服务端创建socket
io.on('connection', function(socket) {
  socket.on('message', function(str) {   //接受客户端发送过来的消息  socket.on()
    let mes = {}
    if (str.hasOwnProperty('name')) {
      let id = new Date().getTime();
      socket.userName = str.name;
      socket.tocken = id;
      mes.name = str.name;
      mes.tocken = id,
      mes.infrom =  '欢迎'+ str.name + '进入聊天室'
    }
    if (str.hasOwnProperty('val')) {
      mes.val = str.val;
      mes.user = str.user;
      mes.date = new Date().Format("yyyy-MM-dd HH:mm:ss")
    }
    io.emit('message', mes);  //推送消息到客户端   io.emit()
  })
  //断开事件
  socket.on('disconnect', function() {  // socket.on('disconnect', () => {})  
    let mes = {
      tocken: socket.tocken,
      leaveMessage: socket.userName + '离开了聊天室'
    }
    io.emit('leave', mes);  //推送消息到客户端 io.emit()
  })
})

console.log('websocket server listening on port' + port);