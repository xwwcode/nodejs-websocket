window.onload = function() {
  let obj = {};
  let userName;
  //用户插入
  function userList(str) {
    var user = document.createElement('div');
    user.className = 'list';
    user.style.borderBottom = '1px solid #Ccc'
    user.innerHTML = str.name;
    user.setAttribute('tocken', str.tocken);
    document.getElementsByClassName('right')[0].appendChild(user);

    var infrom = document.createElement('div');
    infrom.className = 'infrom';
    infrom.innerHTML = str.infrom;
    document.getElementsByClassName('joinMessage')[0].appendChild(infrom);
  }
  //用户进入提示
  function infrom() {
    let infroms = document.getElementsByClassName('infrom');
    console.log(infroms);
    if (infroms.length == 0) {
      return;
    }
    if (infroms.length > 3) {
      document.getElementsByClassName('joinMessage')[0].removeChild(infroms[0]);
    }
  }
  //聊天消息插入
  function infromMessage(str) {
    var list = document.createElement('div');
    list.innerHTML = `<div>${str.user} ${str.date}</div>
                      <div>${str.val}</div>`;
    document.getElementsByClassName('chartMessage')[0].appendChild(list);
  }
  //用户离开提示
  function outInfrom(str) {
    let list = document.getElementsByClassName('list');
    console.log(list, document.getElementsByClassName('list'));
    for(let i = 0; i < list.length; i++) {
      console.log(list[i].getAttribute('tocken'))
      if (list[i].getAttribute('tocken') == str.tocken) {
        document.getElementsByClassName('right')[0].removeChild(list[i]);
        var infrom = document.createElement('div');
        infrom.className = 'infrom';
        infrom.innerHTML = str.leaveMessage;
        document.getElementsByClassName('joinMessage')[0].appendChild(infrom);
      }
    }
  }
  //websocket方法
  let websocket = new WebSocket('ws://localhost:3000/');
  websocket.onopen = function() {
    // 将用户发送个服务器
    document.getElementById('submit').onclick= function() {
      userName = document.getElementById('val').value;
      if (userName) {
        document.getElementsByClassName('position')[0].style.display = 'none';
        obj = {
          name: userName
        }
        websocket.send(JSON.stringify(obj));
      } else {
        alert('请输入用户名');
      }
    }
    // 将消息推送给服务器
    document.getElementsByClassName('send')[0].onclick = function () {
      let textVal = document.getElementById('text').value;
      if (textVal) {
        obj = {
          val: textVal,
          user: userName
        }
        websocket.send(JSON.stringify(obj));
      }
    }
  }
  websocket.onclose = function() {
  }
  //监听服务器返回的内容
  websocket.onmessage = function(mes) {
    if (JSON.parse(mes.data).hasOwnProperty('name')) { //用户登录时
      userList(JSON.parse(mes.data));
    } else if (JSON.parse(mes.data).hasOwnProperty('val')) {  //用户发送消息时
      console.log(JSON.parse(mes.data));
      infromMessage(JSON.parse(mes.data));
    } else if (JSON.parse(mes.data).hasOwnProperty('tocken')) {  //用户离开时
      console.log(JSON.parse(mes.data))
      outInfrom(JSON.parse(mes.data));
    }
    infrom();
  }
}