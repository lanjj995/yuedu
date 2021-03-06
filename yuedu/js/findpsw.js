window.addEventListener('load',readyLoad);
function readyLoad(){
    // 验证事件
    var findformEle = document.querySelector(".login_form");
    findformEle.addEventListener('blur',checkHandler,true);
    // 提交事件
    var saveEle = document.getElementById("saveBtn");
    saveEle.addEventListener('click',updatepsw,true);

    var getBtn = document.getElementById("getBtn");
    getBtn.addEventListener('click',updatepsw,true);
}
// 获取验证码
function getcaptcha() {
    // 验证手机号
    if (!validate('txtPhone', '请输入手机号', /^1[34578]\d{9}$/, '手机格式不合法', false)) return;
    // 获取验证码
    ajax("GET", url+"/captcha?type=register&phone=" + phone, function (data) {
        if (data.code === "SUCCESS") {
            alert(data.captcha);
        } else {
            alert(data.message);
        }
    }, null);
}

// 修改密码
function updatepsw() {
    // 验证
    if (!validate('txtPhone', '请输入手机号', /^1[34578]\d{9}$/, '手机格式不合法', false)) return;
    if (!validate('txtCode', '请输入验证码', /[0-9]{6}/, '验证码必须是6位', false)) return;
    if (!validate('txtPassword', '请输入密码', /\w{6,32}/, '密码必须是6-32位', false)) return;
    if (!validate('txtPassword2', '请确认密码', null, '两次输入的密码不一致', true)) return;
    
    var phone = document.getElementById("txtPhone").value;
    var password = document.getElementById("txtCode").value;
    var captcha = document.getElementById("txtPassword").value;
    var params = "phone=" +phone+ "&password=" +password+ "&captcha=" +captcha;    
    ajax("POST","https://dev.apis.ittim.ltd/P3r2G0wTf/account/reset",function(data){
        if (data.code === "SUCCESS") {
            alert("修改密码成功");
        } else {
            alert(data.message);
        }
    },params);
}
