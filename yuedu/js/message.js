window.addEventListener('load',readyLoad);

// 页面加载事件
function readyLoad() {
    // 验证token
    verifyToken();
    // 设置头信息
    onloadMessage();
    // 加载第一页
    loadArticle(1);
    // 瀑布流
    window.addEventListener('scroll',_.throttle(scrollFunc(),5000));
    // 懒加载
    window.addEventListener('scroll',lazyload);
    // 
    var upEle = document.querySelector(".loading_up");
    upEle.addEventListener("click", scrollToTop, true);
    var articlesEle = document.querySelector(".articles");
    articlesEle.addEventListener("click", click, true);
}

// 瀑布流
function scrollFunc() {
    var page = 2;
    return function () {
        var loading = document.querySelector(".loading");
        // 瀑布流
        if (loading) {
            if (loading.getBoundingClientRect().top + loading.offsetHeight < document.documentElement.clientHeight) {
                loadArticle(page++);
            }
        }
    }
}

// 懒加载
function lazyload() {
    // 获取所有img
    var imgs = document.getElementsByClassName('cover');
    // 循环所有图片
    for (var i = 0; i < imgs.length; i++) {
        // 图片请求后不再执行该函数
        var img = imgs[i];
        if (img.getBoundingClientRect().top + img.offsetHeight < document.documentElement.clientHeight) {
            if (img.dataset.src === '') continue;
            // 当图片出现在视窗中时，请求该图片。
            preload(img);
            img.dataset.src = '';
        }
    }
    // 点击到顶部
    var upEle = document.querySelector(".loading_up");
    if (document.documentElement.scrollTop > 100) {
        upEle.style.display = "block";
    } else {
        upEle.style.display = "none";
    }
}

// 加载文章
function loadArticle(page) {
    ajax("GET", "http://localhost:8989/yuedu/json/list.json?limit=3&page=" + page, function (result) {
        if (result.code === "SUCCESS") {
            var articles = result.data.articles;
            // 文章总个数
            var count = result.count;
            document.querySelector('.message_article_title').innerText = '文章('+count+')';
            // 头部作者信息
            doMessage(result.data.articles[0].author);
            for (var index in articles) {
                var articlesDiv = document.querySelector(".articles");
                var article = `
                <a href="http://localhost:8989/yuedu/article_details.html?id=${articles[index]._id}">
                    <div class="article"> 
                        <div class="article_img">
                            <img src="./images/loading.gif" data-src="${articles[index].cover}" class="cover">      
                        </div>
                        <div class="article_msg">
                            <p class="article_msg_title">${articles[index].title}</p>
                            <p class="article_msg_content">
                            ${articles[index].abstract ? articles[index].abstract : "......"}
                            </p>
                            <p class="article_msg_bottom">
                                <a href="./message.html?id=${articles[index].author._id}">
                                    <img src="./images/loading.gif" alt="" data-src="${articles[index].author.avatar}" class="author_header cover"/>
                                    ${articles[index].author.name.length > 6 ? articles[index].author.name.substring(0, 6) : articles[index].author.name}
                                </a>
                                <span class="time">${filterTime(articles[index].create_time)}</span>
                                <span class="fr">
                                    <a class="thumb" data-click="zan"></a>
                                    <span>${articles[index].praise_sum ? articles[index].praise_sum : 0}</span>
                                    <a class="saw"></a>
                                    <span>${articles[index].look_sum ? articles[index].look_sum : 0}</span>
                                </span>
                            </p>
                        </div>
                    </div>
                </a>
                `;
                articlesDiv.innerHTML += article;
            }
            lazyload();
        } else {
            alert(result.message);
        }
    }, null);
}

// 预加载
function preload(img) {
    var tmpImg = new Image();
    tmpImg.onload = function () {
        img.src = tmpImg.src;
    }
    tmpImg.onerror = function () {
        img.src = './images/error.jpg';
    }
    // 通过dataset获取图片的真实地址
    tmpImg.src = img.dataset.src;
}

// 设置信息
function doMessage(user) {
    // 设置昵称
    document.querySelector(".username1").innerText = user.name.length < 6 ? user.name : user.name.substring(0, 6);
    // 设置背景
    var defaultBackgroundUrl = './images/bg_center.png';
    var backgroundUrl = user.background ? "./images/" + user.background.split("/")[1].split(".")[0] + ".png" : defaultBackgroundUrl;
    document.querySelector(".message_head").style.cssText += "background-image:url('" + backgroundUrl + "')";
    // 设置头像
    preLoadImg(user.avatar, "#authorAvatar");
    // 设置性别
    document.querySelector(".sex_img").style.cssText = user.gender === "man" ? "background:url('./images/icon_boy.png')" : "background:url('./images/icon_girl.png')";
    // 设置城市
    var city = document.querySelector(".city");
    city.innerText = user.city?(user.city+'').length>6?(''+user.city).substring(0,3):user.city:"未设置";
    // 设置星座
    document.querySelector(".constellation").innerText = user.constellations ? user.constellations : "未设置";
}


function click(event) {
    var targetEle = event.target;
    if (targetEle.dataset.click === "zan") {
        if (getCssStyle(targetEle, 'backgroundImage').indexOf('like') === -1) {
            targetEle.style.cssText += "background:url('./images/icon_thumb_up_like.png')";
            var number = +targetEle.nextSibling.nextSibling.innerText;
            targetEle.nextSibling.nextSibling.innerText = number+1;
        } else {
            targetEle.style.cssText += "background:url('./images/icon_thumb_up.png')";
            targetEle.nextSibling.nextSibling.innerText -= 1;
        }
    }
}

// 滚动到顶端
function scrollToTop() {
    var timer = setInterval(function (){
        var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        scrollTop -= 10;
        if (scrollTop < 0) scrollTop = 0; 
       if (scrollTop == 0) {
           clearInterval(timer);
       } else {
           window.scrollTo(0,scrollTop);
       }
    }, 10);
}

// 验证token
function verifyToken(){
    if (!(localStorage.getItem("user"))) {
        location.href = "./login.html";
    }    
}