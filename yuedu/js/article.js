// load添加事件处理函数
window.addEventListener('load', readyLoad);
// load事件处理函数
function readyLoad() {
    // 加载右上角
    loadRightTop();
    // 加载第一页
    loadArticle(1);
    // 绑定滚动事件 瀑布流
    window.addEventListener("scroll", _.throttle(scrollFunc(), 5000));
    // 监听滚动事件 懒加载
    window.addEventListener("scroll", lazyload);
    // 详情事件
    var articlesEle = document.querySelector(".articles");
    var upEle = document.querySelector(".loading_up");
    upEle.addEventListener("click", scrollToTop, true);
    articlesEle.addEventListener("click", click, true);
}

// 加载文章
function loadArticle(page) {
    ajax("GET", "http://localhost:8989/yuedu/json/list.json?limit=3&page=" + page, function (result) {
        if (result.code === "SUCCESS") {
            var articles = result.data.articles;
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

// 懒加载
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

