$(function(){
    var form = layui.form;//导入form
    var layer = layui.layer;//导入layer
    //0.设置表单信息
    //用等号切割，然后使用后面的值
    //JS中location.search什么意思：设置或获取 网页地址跟在问号后面的部分当以get方式在url中传递了请求参数时，可以利用location的search属性提取参数的值
    // alert(location.search.split("=")[1]);
    function initForm(){
        var id = location.search.split("=")[1];
        $.ajax({
            method:"GET",
            url:"/my/article/"+id,
            success:function(res){
                //校验
                console.log(res);
                //赋值,渲染 form
                form.val("form-edit",res.data);
                // tinyMCE.activeEditor.setContent(res.data.content);

                var newImgURL = baseURL + res.data.cover_img;
                $image
                    .cropper('destroy')      // 销毁旧的裁剪区域
                    .attr('src', newImgURL)  // 重新设置图片路径
                    .cropper(options)        // 重新初始化裁剪区域
            }
        })
    }
    //1.初始化分类

    initCate();//调用函数
    //封装
    function initCate(){
        $.ajax({
            method:"GET",
            url:"/my/article/cates",
            success:function(res){
                //校验
                if(res.status !== 0){
                    return layer.msg(res.message);
                }
                //赋值,渲染 form
                var htmlStr = template("tpl-cate",res);
                $("[name=cate_id]").html(htmlStr);
                form.render();
                //文章分类渲染完毕再调用，初始化form的方法
                initForm();
            }
        })
    }
    // 初始化富文本编辑器
        initEditor();
    // 1. 初始化图片裁剪器
    var $image = $('#image')
  
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
  
    // 3. 初始化裁剪区域
    $image.cropper(options)
    //4.点击按钮，选择图片
    $("#btnChooseImage").on("click",function(){
        $("#coverFile").click();
    })
    //5.设置图片
    $("#coverFile").change(function(e){
        //拿到用户选择的文件
        var file = e.target.files[0]
        //非空校验！ URL.creatObjectURL()参数不能为undefined
        if(file == undefined){
            return;
        }
        //根据选择的文件，船舰一个对应的URL地址;
        var newImgURL = URL.createObjectURL(file)
        //先销毁旧的裁剪区域，在重新设置图片路径，之后在创建新的裁剪区域
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })
    //6.设置状态
    var state = "已发布";
    $("#btnSave2").on("click",function(){
        state = "草稿"
    })
    //7.添加文章
    $("#form-pub").on("submit",function(e){
        //阻止提交
        e.preventDefault();
        //创建FormDate对象，收集数据
        var fd = new FormData(this);
        //放入状态
        fd.append("state",state);
        //放入图片
        $image.cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 400,
            height: 280
        })
        .toBlob(function(blob) {// 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
            fd.append("cover_img",blob);
            //发送   ajax ，要在toBlob()函数里面！！
            publishArticle(fd);
        })
    })
    //封装，添加文章的方法
    function publishArticle(fd){
        $.ajax({
            method:"POST",
            url:"/my/article/edit",
            data:fd,
            contentType:false,
            processData:false,
            success:function(res){
                //失败判断
                if(res.status !== 0){
                    return layer.msg(res.message);
                }
                layer.msg("恭喜您，修改文章成功！");
                // 跳转
                setTimeout(function(){
                    window.parent.document.getElementById("art_list").click()
                },1500)
            }
        })
    }
})