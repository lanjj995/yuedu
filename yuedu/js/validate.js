function checkHandler(event){
    var id = event.target.id;
    switch (id) {
        case 'txtPhone':
            validate(id, '请输入手机号', /^1[34578]\d{9}$/, '手机格式不合法', false);
            break;
        case 'txtCode':
            validate(id, '请输入验证码', /[0-9]{6}/, '验证码必须是6位', false);
            break;
        case 'txtPassword':
            validate(id, '请输入密码', /\w{6,32}/, '密码必须是6-32位', false);
            break;
        case 'txtPassword2':
            validate(id, '请确认密码', null, '两次输入的密码不一致', true);
            break;
    }
}

// 验证
function validate(id, requiredMessage, reg, regMessage, isConfirm) {
    var tarEle = document.getElementById(id);
    var value = tarEle.value;
    var condition = isConfirm ? value === document.getElementById("txtPassword").value : reg.test(value);
    if (value) {
        if (condition) {
            return true;
        } else {
            var spanEle = document.createElement("span");
            spanEle.className = "validate";
            spanEle.innerText = regMessage;
            insertAfterSpan(spanEle, tarEle, regMessage);
            return false;
        }
    } else {
        var spanEle = document.createElement("span");
        spanEle.className = "validate";
        spanEle.innerText = requiredMessage;
        insertAfterSpan(spanEle, tarEle, requiredMessage);
        return false;
    }
}

// 向目标元素后添加一个新的元素
function insertAfterSpan(newElement, targetElement, txt) {
    // 获取父节点
    var parentNode = targetElement.parentNode;
    // 添加
    parentNode.lastChild.nodeType === 1 ? parentNode.lastChild.innerText = txt : parentNode.appendChild(newElement);
}