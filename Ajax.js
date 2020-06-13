function getAjax(httpUrl,callbackFn) {
    //创建xhr对象
    var xhr = new XMLHttpRequest();
    //设置请求的方法和路径，“Get”“POST”
    //get 表单提交的数据会拼接到请求的路径里，效率高
    //post 会将表单的数据放置到请求的body里，数据大，安全
    xhr.open("GET",httpUrl);
    //xhr.open("POST","地址")
    //xhr.open("GET","地址?数据")

    //发送数据
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.status == 200 && xhr.readyState == 4) {
            callbackFn(xhr);

        }
    }
}