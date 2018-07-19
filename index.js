'use strict';

global.util = require('./util.js');
global.express = require('express');
const bodyparser = require('body-parser');
const app = express();
const logger = log4js.getLogger('system');

// 静态文件中间件
app.use('/public', express.static('public'));

// 配置post body解析中间件
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

// 挂载自定义路由表(勿删)

// 处理favicon.ico请求
const favicon = require('serve-favicon');
app.use(favicon(rootPath.concat('/public/favicon.ico')));

// 404错误中间件
app.use((req, res, next) => {
  logger.error(req.url.concat(' not found'));
  res.status(404).send(config.message.notfound);
});

// 服务器内中错误处理
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send(config.message.servererr);
});

// 当发生了未捕获的promise 打印日志
process.on('uncaughtException', (reason, p) => {
  logger.error('Unhandled Rejection at: Promise ', p, ' reason: ', reason);
});

// 当发生了未捕获的异常 守护中间件
process.on('uncaughtException', (err) => {
  logger.error(err.stack);
});

// 开启web服务器
const server = app.listen(config.port, () => logger.info('服务器启动成功!', '端口号:', config.port));

// ===============================================================================================
const SerialPort = require('serialport');
global.serialPort = new SerialPort('/dev/ttyS1', { baudrate: 9600, autoOpen: false, parser: SerialPort.parsers.byteDelimiter([ 0xfc, 0xff ]) });
const protocol24 = require(rootPath.concat('/service/protocol24.js'));
serialPort.open(function (error) {
  if (error) {
    logger.error('通信串口打开失败', error);
    return;
  }
  logger.error('通信串口打开成功');
  // protocol24.start();

  serialPort.on('data', (data) => {
    // 初步解析数据
    const result = util.parseResult(data);
    console.log(result);
    protocol24.parseData(result);
  });

  serialPort.on('error', (error) => {
    logger.error('通信串口报错', error);
  });
  serialPort.on('disconnect', () => {
    logger.error('通信串口报错连接关闭');
    global.serialPort = null;
  });
  serialPort.on('close', () => {
    logger.error('通信串口报错连接断开');
    global.serialPort = null;
  });
});

// ========================================服务器socket
// global.serverSocket = require('socket.io-client')(config.cloudsocket, { autoConnect: true });
// const serverService = require(rootPath.concat('/service/serverService.js'));
// serverService.start();

// ============================================开始socket服务器
const io = require('socket.io')(server);
const devService = require(rootPath.concat('/service/devService.js'));
global.SocketIO = null;
io.on('connect', (socket) => {
  logger.info('浏览器连接成功!');
  global.SocketIO = socket;
  
  socket.on('disconnect', () => {
    logger.info('浏览器断开连接!');
    global.SocketIO = null;
  });
});