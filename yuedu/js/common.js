var baseUrl = 'https://dev.apis.ittim.ltd/P3r2G0wTf';

window.addEventListener('load',init);

function init() {
  loadRightTop();
  var loginOutEle = document.getElementById('loginOut');
  if (loginOutEle) {
    loginOutEle.addEventListener('click',loginOut);
  }
}

// fileAjax
function fileAjax(url, cb, params) {
  if (window.XMLHttpRequest) {
    var Ajax = new XMLHttpRequest();
  } else {
    var Ajax = new ActiveXObject("Microsoft.XMLHTTP");
  }
  Ajax.open('POST', baseUrl+url, true);
  Ajax.send(params);
  Ajax.onreadystatechange = function () {
    if (Ajax.readyState == 4) {
      if (Ajax.status == 200) {
        cb(JSON.parse(Ajax.response));
      } else {
        // ...异常处理
      }
    }
  };
}

// ajax
function ajax(method, url, cb, params) {
  if (window.XMLHttpRequest) {
    var Ajax = new XMLHttpRequest();
  } else {
    var Ajax = new ActiveXObject("Microsoft.XMLHTTP");
  }
  Ajax.open(method, baseUrl+url, true);
  Ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  Ajax.withCredentials = true;
  Ajax.send(params);
  Ajax.onreadystatechange = function () {
    if (Ajax.readyState == 4) {
      if (Ajax.status == 200) {
        var data = JSON.parse(Ajax.responseText);
        cb(data);
      } else {
        // ...异常处理
      }
    }
  };
}
// 图片预加载
function preLoadImg(img, id) {
  var tmpImg = new Image();
  var imgEle = document.querySelector(id);
  // 图片加载成功后，替换临时图片。
  tmpImg.onload = function () {
    imgEle.src = tmpImg.src;
  }
  // 加载失败。
  tmpImg.onerror = function () {
    imgEle.src = './images/error.jpg';
  }
  // 预加载图片(接口返回的图片地址需要前加上服务器地址)。
  tmpImg.src = baseUrl+'/static/' + img;
}
// 加载右上角
function loadRightTop() {
  var noLoginEle = document.querySelector(".nologin");
  var onLoginEle = document.querySelector(".onlogin");
  if (onLoginEle && noLoginEle) {
    if (localStorage.getItem("user")) {
      noLoginEle.style.display = "none";
      onLoginEle.style.display = "block";
      onloadMessage();
    } else {
      noLoginEle.style.display = "block";
      onLoginEle.style.display = "none";
    }
  }
}
// 获取css
function getCssStyle(dom,attribute){
  if (window.getComputedStyle) {
      return window.getComputedStyle(dom,null)[attribute];
  } else {
      return dom.currentStyle[attribute];
  }
}
// 加载个人信息
function onloadMessage() {
  if (localStorage.getItem("user")) {
    // 获取sessionStorage中的数据
    var user = JSON.parse(localStorage.getItem("user"));
    // 设置昵称
    document.getElementById("myname").innerText = user.name;
    // 设置头像
    preLoadImg(user.avatar, "#myheader");
  }
}

// 退出登录
function loginOut() {
  localStorage.removeItem('user');
  location.href = "./login.html";
}

function filterTime(value){
  var create_time = isNaN(value*1) ? new Date(value) : new Date(value*1);
  let now = new Date();
  let cha = now.getTime() - create_time;

  return cha < 24 * 60 * 60 * 1000
    ? cha < 60 * 60 * 1000
      ? Math.floor(cha / (60 * 1000)) + "分钟前"
      : Math.floor(cha / (60 * 60 * 1000)) + "小时前"
    : moment(create_time).format('MM月DD日');
}