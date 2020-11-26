var baseURL = "http://ajax.frontend.itheima.net";
$.ajaxPrefilter(function(params){
    //拼接对应的环境的服务器地址
    params.url = baseURL + params.url;
    if(params.url.indexOf("/my/") !== 1){
        params.headers = {
            Authorization:localStorage.getItem("token") || ""
        }
    }
    //拦截所有响应，判断身份信息
    params.complete = function (res) {
        console.log(res.responseJSON);
        var obj = res.responseJSON;
        if(obj.status == 1 && obj.message == "身份认证失败"){
            //1.清空本地token
            localStorage.removeItem("token");
            //2.页面跳转
            location.href = "/login.html";
        }
    }
})