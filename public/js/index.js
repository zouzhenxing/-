$(function() {
	const socket = io($.getHost().replace('/public',''));
    socket.on('connect', function() {
        $('#message').message('提示','连接服务器成功!');
    });
    socket.on('disconnect', function() {
        $('#message').error('提示','与服务器断开连接!');
    });
    
    // 服务器通知显示桶
	socket.on('TON_update',function(data) {
		$("#tbdata").prepend(ejs.render($("#tpl_mainpanel").html(), {data: data}));
	});
});