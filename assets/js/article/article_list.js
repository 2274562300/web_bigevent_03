$(function(){
    //位 art-template 定义时间过滤器
    template.defaults.imports.dateFormat = function(dtStr){
        var dt = new Date(dtStr)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth()+1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss
    }
    //在个位数的左侧填充 0
    function padZero(n){
        return n > 9 ? n : "0"+n
    }
    //1.定义提交参数；
    var q = {
        pagenum : 1,  //页码
        pagesize : 2,   //每页显示多少条数据
        cate_id : "",   //文章分类的Id
        state : "",     //文章的状态，可选值有：已发布、草稿
    }
    //初始化文章列表
    initTable();
    function initTable(){
        $.ajax({
            method:"GET",
            url:"/my/article/list",
            data:q,
            success:function(res){
                var str = template("tpl-table",res);
                $("tbody").html(str);
                //分页
                renderPage(res.total)
            }
        })
    }
    //初始化分类
    var form = layui.form;//导入form
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
                //赋值,渲染form
                var htmlStr = template("tpl_cate",res);
                $("[name=cate_id]").html(htmlStr);
                form.render();
            }
        })
    }
    //编辑功能
    $("tbody").on("click","#bianji",function(){
        location.href="/article/article_edit.html?id="+$(this).attr('data-id')
    })
    //筛选功能
    $("#form-search").on("submit",function(e){
        e.preventDefault();
        //获取
        var state = $("[name=state]").val();
        var cate_id = $("[name=cate_id]").val()
        //赋值
        q.state = state;
        q.cate_id = cate_id;
        //初始化文章列表
        initTable();
    })
    //分页
    var laypage = layui.laypage;
    function renderPage(total) {
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
          elem: 'pageBox', // 分页容器的 Id
          count: total, // 总数据条数
          limit: q.pagesize, // 每页显示几条数据
          curr: q.pagenum, // 设置默认被选中的分页
          layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
          limits: [2, 3, 5, 10],// 每页展示多少条
          jump:function(obj,first){
              q.pagenum = obj.curr;
              // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
              q.pagesize = obj.limit
              if(!first){
                  initTable();
              }
          }
        })
    }
    //删除
    var layer= layui.layer;
    $("tbody").on("click",".btn-delete",function(){
        //！！！！先获取  Id 进入到函数中this代指就改变了
        var Id = $(this).attr("data-id");
        //显示对话框
        layer.confirm('是否确认删除?', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
                method:"GET",
                url:"/my/article/delete/" + Id,
                success:function(res){
                    if(res.status !== 0){
                        return layer.msg(res.message)
                    }
                    initTable();
                    layer.msg("恭喜您，文章删除成功！");
                    if ($(".btn-delete").length == 1 && q.pagenum > 1)q.pagenum--;
                        // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                        // 页码值最小必须是 1
                        
                }
                
            })
            layer.close(index);
        });
    })
})