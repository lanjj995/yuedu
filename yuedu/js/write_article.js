window.addEventListener('load', readyLoad);
function readyLoad() {
    verifyToken();
    var fileInput = document.getElementById("uploadArticleImg");
    fileInput.addEventListener("change", fileInputChange, false);
    var writeEle = document.getElementById("write");
    writeEle.addEventListener("click", addArticle, false);
}
// 图片预览
function fileInputChange(event) {
    var img = event.target.files[0];
    if ((img.size / 1024 / 1024) > 3) {
        alert("上传图片不能大于3M");
        return;
    }
    var fileReader = new FileReader();
    fileReader.addEventListener('load', function () {
        document.querySelector('.content_img_content').style.display = 'none';
        document.querySelector('.content_img_upload').style.display = 'block';
        document.getElementById("img").src = this.result;
    }, false);
    fileReader.readAsDataURL(img);
}
// 添加文章
function addArticle() {
    var title = document.getElementById("title").value;
    if (!title) {
        alert("请选择图片");
        return;   
    }
    var body = document.getElementById("content").value;
    if (!body) {
        alert("请选择图片");
        return;
    }
    var img = document.getElementById('uploadArticleImg').files[0];
    if (!img) {
        alert("请选择图片");
        return;
    }
    var formData = new FormData();
    formData.append("token", localStorage.getItem("token"));
    formData.append("title", title);
    formData.append("pic", img);
    formData.append("body", body);
    fileAjax("/posts/add", function (data) {
        if (data.code === "SUCCESS") {
            location.href = "./article.html";
        } else {
            alert(data.message);
        }
    }, formData);
}

// 验证token
function verifyToken() {
    if (!(localStorage.getItem("user"))) {
        location.href = "./login.html";
    }
}
