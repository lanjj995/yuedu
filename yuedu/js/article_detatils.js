window.addEventListener('load', readyLoad);
// 加载事件
function readyLoad() {
    var _id = window.location.href.split("?")[1].split("=")[1];
    loadArticle(_id);
    loadConmment(1,_id);
    window.addEventListener('scroll', _.throttle(scrollFunc(),5000));
    window.addEventListener('scroll', lazyload);
    var loadUpEle = document.querySelector('.loading_up');
    loadUpEle.addEventListener('click',scrollToTop);
    var commentEle = document.getElementById("comments");
    commentEle.addEventListener("click", click);
    var zanEle = document.getElementById("zan");
    zanEle.addEventListener("click", click);  
    
    var commentBtnEle = document.getElementById("commentBtn");
    commentBtnEle.addEventListener("click", addComment);  
}

// 加载文章
function loadArticle(_id) {
    if (!localStorage.getItem('user')) document.getElementById("commentBtn").value = '登录评论';
    ajax("GET", "./json/details.json", function (data) {
        if (data.code === "SUCCESS") {
            var article = data.data.article;
            document.getElementById("title").innerText = article.title;
            preLoadImg(article.author.avatar, "#author_header");
            document.getElementById("author").innerText = article.author.name;
            var time = article.create_time;
            document.getElementById("time").innerText = filterTime(article.create_time);
            document.getElementById("zannumber").innerText = article.praise_sum || 0;
            preLoadImg(article.pic, "#detailsImg");
            document.getElementById("content").innerText = article.body;
            document.getElementById('gomsg').href = './message.html?id='+article.author._id;
        } else {
            alert(data.message);
        }
    }, null);
}

// 加载评论
function loadConmment(page, id) {
    ajax("GET", "./json/comment1.json?page=" + page + "&limit=3&article=" + id, function (data) {
        if (data.code === "SUCCESS") {
            var comments = data.data.comments;
            for (var index in comments) {
                var commentsEle = document.getElementById("comments");
                commentsEle.innerHTML += getComment(comments[index]);
            }
        } else {
            alert(data.message);
        }
    }, null);
}

// 评论
function addComment() {
    if (!localStorage.getItem('user')) location.href = "./login.html";
    var _id = window.location.href.split("?")[1].split("=")[1];
    var token = localStorage.getItem("token");
    var body = document.getElementById("commentTextarea").value;
    var user = JSON.parse(localStorage.getItem("user"));
    var comment = {
        author:user,
        create_time:new Date(),
        body
    };
    ajax("POST", baseUrl + "/comment/add", function (data) {
        if (data.code === "SUCCESS") {
            var commentsEle = document.getElementById("comments");
            commentsEle.innerHTML += getComment(comment);
            document.querySelector("#commentTextarea").value = "";
        } else {
            alert(data.message);
        }
    }, "token=" + token + "&body=" + body + "&article=" + _id);
}

// 获取评论
function getComment(comment) {
    var comment =
        ` <div class="comment">
                    <div class="comment_author">
                        <div class="article_msg_bottom_left">
                            <a href='./message.html?id=${comment.author._id}'> 
                                <img src="./images/loading.gif" class="user_header cover" data-src='${comment.author.avatar}'>
                                <span class="username">${comment.author.name}</span>
                            </a>
                            <span class="time">${filterTime(comment.create_time)}</span>
                        </div>
                        <div class="article_msg_bottom_right">
                            <div class="zan">
                                <img src="./images/icon_thumb_up.png"  data-click="zan">
                                <span class="zannumber">${comment.praise_sum || 0}</span>
                            </div>
                        </div>
                    </div>
                    <div class="comment_content">
                        ${comment.body}
                    </div>
        </div>`;

    return comment;
}

// 瀑布流
function scrollFunc() {
    var page = 2;
    return function(){
        var _id = window.location.href.split("?")[1].split("=")[1];
        var loading = document.querySelector(".loading");
        if (loading) {
            if (loading.getBoundingClientRect().top + loading.offsetHeight < document.documentElement.clientHeight) {
                    loadConmment(page++, _id);   
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
        if (targetEle.src.indexOf('like') === -1) {
            targetEle.src = './images/icon_thumb_up_like.png';
            var number = +targetEle.nextSibling.nextSibling.innerText;
            targetEle.nextSibling.nextSibling.innerText = number+1;
        } else {
            targetEle.src = "./images/icon_thumb_up.png";
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
