window.addEventListener("load", readyLoad);

// load函数
function readyLoad() {
    // 事件代理
    var loginFormEle = document.querySelector(".login_form");
    // 为父元素绑定事件代理
    loginFormEle.addEventListener("blur", checkHandler, true);

    var registBtn = document.getElementById("registBtn");
    if (registBtn) registBtn.addEventListener("click",regist,false);

    var loginBtn = document.getElementById("loginBtn");
    if (loginBtn) loginBtn.addEventListener("click",login,false);
}

// 获取验证码
function getcaptcha() {
    // 验证手机号
    if (!validate('txtPhone', '请输入手机号', /^1[34578]\d{9}$/, '手机格式不合法', false)) return;
    // 获取验证码
    ajax("GET", url + "/captcha?type=register&phone=" + phone, function (data) {
        if (data.code === "SUCCESS") {
            alert(data.captcha);
        } else {
            alert(data.message);
        }
    }, null);
}

// 注册
function regist() {
    // 验证
    if (!validate('txtPhone', '请输入手机号', /^1[34578]\d{9}$/, '手机格式不合法', false)) return;
    if (!validate('txtCode', '请输入验证码', /[0-9]{6}/, '验证码必须是6位', false)) return;
    if (!validate('txtPassword', '请输入密码', /\w{6,32}/, '密码必须是6-32位', false)) return;
    if (!validate('txtPassword2', '请确认密码', null, '两次输入的密码不一致', true)) return;

    // 获取手机号
    var phone = document.getElementById("txtPhone").value;
    // 获取验证码
    var captcha = document.getElementById("txtCode").value;
    // 获取密码
    var password = document.getElementById("txtPassword").value;

    ajax("POST", url + "/account/register", function (data) {
        if (data.code === "SUCCESS") {
            openlogin();
        } else {
            alert(data.message);
        }
    }, "account=" + phone + "&password=" + password + "&captcha=" + captcha);
}

// 登录
function login() {
    if (!validate('txtPhone', '请输入手机号', /^1[34578]\d{9}$/, '手机格式不合法', false)) return;
    if (!validate('txtPassword', '请输入密码', /\w{6,32}/, '密码必须是6-32位', false)) return;
    // 获取手机号
    var phone = document.getElementById("txtPhone").value;
    // 获取验证码
    var password = document.getElementById("txtPassword").value;
    
    ajax("POST", url + "/account/login", function (data) {
        if (data.code === "SUCCESS") {
            localStorage.setItem("user", JSON.stringify(data.data.user));
            localStorage.setItem("token", data.data.user.token);
            location.href = "http://localhost:8080/article.html";
        } else {
            alert(data.message);
        }
    }, "account=" + phone + "&password=" + password);
}
