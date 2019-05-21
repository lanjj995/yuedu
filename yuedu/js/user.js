window.addEventListener('load', readyLoad);

// 页面加载成功事件函数
function readyLoad() {
    verifyToken();
    var user = JSON.parse(localStorage.user);
    loadDetailsMessage(user);
    loadConstellation(user);
    loadProvice(user);
    //头像预览
    var file = document.querySelector("#headerImg");
    file.addEventListener("change", fileChange, false);
    // 编辑账户信息
    var saveBtn = document.getElementById("saveBtn");
    saveBtn.addEventListener('click', updateuser);
    // 省份change事件
    var addressEle = document.getElementById("address");
    addressEle.addEventListener('change', changeHandler, true);
}

// change事件
function changeHandler(event) {
    var currentTarget = event.currentTarget;
    var target = event.target;
    if (target.getAttribute('id') === "province") {
        let cityEle = document.getElementById('city');
        if (cityEle) currentTarget.removeChild(cityEle);
        let areaEle = document.getElementById('area');
        if (areaEle) currentTarget.removeChild(areaEle);
        if (!target.value) {
            return;
        }
        pca('http://localhost:8989/AJax_day3/city/showCityByCode?code=' + target.value, currentTarget, 'city');
    }
    if (target.getAttribute('id') === "city") {
        if (!target.value) {
            let areaEle = document.getElementById('area');
            if (areaEle) currentTarget.removeChild(areaEle);
            return;
        }
        pca('http://localhost:8989/AJax_day3/area/showAreaAction?code=' + target.value, currentTarget, 'area');
    }
}

// 添加市区
function pca(url, target, id, city) {
    ajax("GET", url, function (data) {
        if (data.code === "SUCCESS") {
            var list = data.data.list;
            if (document.getElementById(id)) {
                target.removeChild(document.getElementById(id));
            } else {
                var selectEle = document.createElement('select');
                selectEle.id = id;
                var optionEle0 = document.createElement('option');
                optionEle0.value = 0;
                optionEle0.innerText = '请选择';
                selectEle.appendChild(optionEle0);
                for (var i = 0; i < list.length; i++) {
                    var optionEle = document.createElement('option');
                    optionEle.value = list[i].code;
                    optionEle.innerText = list[i].name;
                    if (city) {
                        console.log(city);
                        var code = id === 'city' ? city[1] : city;
                        if (code === list[i].code) {
                            optionEle.selected = true;
                            if (id === 'city') {
                                pca('http://localhost:8989/AJax_day3/area/showAreaAction?code=' + city[1], target, 'area', city[2]);
                            }
                        }
                    }
                    selectEle.appendChild(optionEle);
                }
                target.appendChild(selectEle);
            }
        } else {
            alert("err");
        }
    }, null);
}

// 头像预览
function fileChange() {
    var headerImg = this.files[0];
    if ((headerImg.size / 1024) > 300) {
        alert("上传头像不能大于300K");
    } else {
        var fileReader = new FileReader();
        fileReader.addEventListener('load', function () {
            var header = document.getElementById('header');
            header.src = fileReader.result;
        }, false);
        fileReader.readAsDataURL(headerImg);
    }
}
// 星座列表渲染
function loadConstellation() {
    ajax("GET", "http://localhost:8989/yuedu/json/xingzuo.json", function (data) {
        var constellations = data.data.constellations;
        if (data.code === "SUCCESS") {
            var constellationSelect = document.querySelector("#constellation");
            for (var index in constellations) {
                var option = document.createElement("option");
                option.innerText = constellations[index];
                option.value = constellations[index];
                constellationSelect.appendChild(option);
            }
        } else {
            alert(data.data);
        }
    }, null);
}

// 省份列表渲染
function loadProvice(user) {
    ajax("GET", "http://localhost:8989/AJax_day3/pro/showAllPro", function (data) {
        var provinces = data.data.list;
        if (data.code === "success") {
            var provinceSelect = document.querySelector(".province");
            for (var index in provinces) {
                var option = document.createElement("option");
                option.innerText = provinces[index].name;
                option.value = provinces[index].code;
                if (user.city)
                    if (user.city[0] === provinces[index].code) {
                        option.selected = true;
                        pca('http://localhost:8989/AJax_day3/city/showCityByCode?code=' + provinces[index].code, provinceSelect.parentElement, 'city', user.city);
                    }
                provinceSelect.appendChild(option);
            }
        } else {
            alert(data.data);
        }
    }, null);
}

// 加载信息
function loadDetailsMessage(user) {
    // 设置头像
    preLoadImg(user.avatar, ".header");
    //设置昵称
    document.querySelector(".username").value = user.name;
    // 设置性别
    user.gender === "man" ? document.querySelector("#male").checked = true : document.querySelector("#female").checked = true;
    var constellation = user.constellations;
    // 设置星座
    document.querySelector("#constellation").innerHTML = `<option value="${constellation ? constellation : '请选择'}">${user.constellations ? user.constellations : "请选择"}</option>`;
    // 城市
}

// 编辑账户信息
function updateuser() {
    // 用户凭证
    var token = localStorage.getItem("token");
    // 头像 
    var file = document.getElementById("headerImg").files[0];
    // 昵称
    var name = document.querySelector(".username").value;
    // 性别
    var sexInputs = document.getElementsByName("sex");
    var sex;
    for (var index in sexInputs) {
        if (sexInputs[index].checked) {
            sex = sexInputs[index].value;
        }
    }
    // 星座
    var constellation = document.getElementById("constellation").value;
    // 城市
    var province = +(document.getElementById("province").value);
    var city = +(document.getElementById("city").value);
    var area = +(document.getElementById("area").value);
    var cities = [];
    cities.push(province);
    cities.push(city);
    cities.push(area);
    var jsonctits = JSON.stringify(cities);
    var formData = new FormData();
    if (file) {
        formData.append('avatar', file) // 此处file为用户上传图片
    }

    formData.append('token', token);
    if (sex) {
        formData.append('gender', sex);
    }
    if (constellation) {
        formData.append('constellations', constellation);
    }
    if (name) {
        formData.append('name', name);
    }
    if (province && city && area) {
        formData.append('city', jsonctits);
    }

    fileAjax("https://dev.apis.ittim.ltd/P3r2G0wTf/account/profile", function (data) {
        if (data.code === "SUCCESS") {
            localStorage.setItem("user", JSON.stringify(data.data.user));
            alert("成功");
        } else {
            alert(data.message);
        }
    }, formData);
}

// 验证token
function verifyToken(){
    if (!(localStorage.getItem("user"))) {
        location.href = "./login.html";
    }    
}