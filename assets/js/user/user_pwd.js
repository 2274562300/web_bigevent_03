$(function(){
    var form = layui.form;
    form.verify({
        //密码
        pwd:[/^[\S]{6,16}$/,"密码必须6~16位，且不能出现空格"],
        //新旧不重复
        samePwd:function(value){
            //value 是新密码，旧密码需要获取
            if(value == $("[name=oldPwd]").val()){
                return "原密码和旧密码不能相同";
            }
        },
        //两次新密码必须相同
        rePwd:function(value){
            //value 是再次输入的新密码，新密码需要重新获取
            if(value !== $("[name=newPwd]").val()){
                return "两次新密码必须一致！"
            }
        }
    })
    //表单提交
    $(".layui-form").on("submit",function(e){
        e.preventDefault();
        $.ajax({
            method:"post",
            url:"/my/updatepwd",
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0){
                    return layui.layer.msg(res.message);
                }
                layui.layer.msg("修改密码成功");
                $(".layui-form")[0].reset();
            }
        })
    })
})