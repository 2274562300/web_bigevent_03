var baseURL = "http://ajax.frontend.itheima.net";
$.ajaxPrefilter(function(params){
    //拼接对应的环境的服务器地址
    params.url = baseURL + params.url;
})