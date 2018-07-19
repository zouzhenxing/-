/**
 * 自定义jquery验证插件
 */
$.fn.extend({
    isEmptyString: function() {
        var reg = /\S+$/;
        return reg.test(this.val());
    },
    isEmail: function() {
        var reg = /^[a-z\d]+(\.[a-z\d]+)*@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$/;
        return reg.test(this.val());
    },
    isPhone: function() {
        var reg = /^1[3|4|5|8][0-9]\d{4,8}$/;
        return !reg.test(this.val());
    }
});

/**
 * 自定义错误提示插件
 */
$.fn.extend({
    warning: function(title, content) {
        title = title || "警告";
        content = content || "这是一个警告!";
        var html = '<div class="alert alert-warning alert-dismissable">' +
            '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>' +
            '<strong>${title}:</strong>&nbsp;&nbsp;${content}' +
            '</div>';

        var $html = $(html.replace("${title}", title).replace("${content}", content)).css("display", "none");
        $(this).html($html);

        $html.clearQueue().delay(100).fadeIn("fast").delay(3000).fadeOut("fast");
        return $(this);
    },
    success: function(title, content) {
        title = title || "成功";
        content = content || "操作成功!";
        var html = '<div class="alert alert-info alert-dismissable">' +
            '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>' +
            '<strong>${title}:</strong>&nbsp;&nbsp;${content}' +
            '</div>';

        var $html = $(html.replace("${title}", title).replace("${content}", content)).css("display", "none");
        $(this).html($html);

        $html.clearQueue().delay(100).fadeIn("fast").delay(3000).fadeOut("fast");
        return $(this);
    },
    message: function(title, content) {
        title = title || "提示";
        content = content || "这是一个提示";
        var html = '<div class="alert alert-success alert-dismissable">' +
            '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>' +
            '<h4>${title}:</h4>&nbsp;&nbsp;${content}' +
            '</div>';

        var $html = $(html.replace("${title}", title).replace("${content}", content)).css("display", "none");
        $(this).html($html);

        $html.clearQueue().delay(100).fadeIn("fast").delay(3000).fadeOut("fast");

        return $(this);
    },
    error: function(title, content) {
        title = title || "错误";
        content = content || "系统错误!";
        var html = '<div class="alert alert-danger alert-dismissable">' +
            '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>' +
            '<strong>${title}:</strong>&nbsp;&nbsp;${content}' +
            '</div>';

        var $html = $(html.replace("${title}", title).replace("${content}", content)).css("display", "none");
        $(this).html($html);

        $html.clearQueue().delay(100).fadeIn("fast").delay(3000).fadeOut("fast");
        return $(this);
    }
});

/**
 * 对ajax的扩展
 */
$.crossDomain = true;
$._ajax = function(option) {
    window.NProgress && NProgress.start();
    var _option = $.extend({
        type: "post",
        dataType: "json",
        xhrFields: {
            withCredentials: true
        }
    }, option);
    return $.ajax(_option).fail(function(err) {
        if (err.status == 404) {
            window.location.href = "login.html";
        }
    }).always(function() {
        window.NProgress && NProgress.done();
    });
}

//获取url地址中传递的参数
$.getOption = function(key) {
    var search = location.search;
    if (search == "") return "";
    search = search.slice(1);
    var searchArr = search.split('&');
    for (var i = 0; i < searchArr.length; i++) {
        var arr = searchArr[i].split('=');
        if (arr[0] == key)
            return arr[1];
    }
    return "";
}

// 获取当前地址
$.getHost = function() {
    return window.location.href.replace(/\w+\.(php|html|htm).*|\?.*|#.*$/, "")
}


//日期格式化封装
Date.prototype.Format = function(fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

//调用： 
// var time1 = new Date().Format("yyyy-MM-dd");
// var time2 = new Date().Format("yyyy-MM-dd hh:mm:ss");