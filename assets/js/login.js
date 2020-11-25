$(function(){
    $("#link_reg").on("click",function(){
        $(".login-box").hide();
        $(".reg-box").show();
    })
    $("#link_login").on("click",function(){
        $(".login-box").show();
        $(".reg-box").hide();
    })
    //3.自定义验证规则
    var form = layui.form;
    form.verify({
        //密码规则
        pwd:[
            /^[\S]{6,16}$/,
            "密码必须6-16位，且不能为空格"
        ],
        //确认密码规则
        repwd:function(value){
            //选择器必须带空格，选择的是后代中的input，那么属性值为password的那一个标签
            var pwd = $(".reg-box input[name = password]").val()
            if(value !== pwd){
                return "两次密码输入不一致";
            }
        }
    })
    //注册功能
    var layer = layui.layer;
    $("#form_reg").on("submit",function(e){
        //阻止表单提交
        e.preventDefault();
        //发送ajax
        $.ajax({
            method:"POST",
            url:"/api/reguser",
            data:$(this).serialize(),
            success:function(res){
                //返回状态判断
                if(res.status != 0){
                    return layer.msg(res.message);
                }
                //提交成功后处理代码
                layer.msg("注册成功，请登录！");
                //手动切换刀登录表单
                $("#link_login").click();
                //重置form表单
                $("#form_reg")[0].reset();
            }
        })
    })
    
    $("#form_login").on("submit",function(e){
        //阻止表单提交
        e.preventDefault();
        //发送ajax
        $.ajax({
            method:"POST",
            url:"/api/login",
            data:$(this).serialize(),
            success:function(res){
                //返回状态判断
                if(res.status != 0){
                    return layer.msg(res.message);
                }
                //提示信息，保存token，跳转页面
                layer.msg("恭喜您，登陆成功");
                //保存token，未来的接口要使用token。
                localStorage.setItem("token",res.token);
                //跳转
                location.href="/index.html"
            }
        })
    })
    
})
