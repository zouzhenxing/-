/**
 * 全局设置
 */
global.rootPath = __dirname;
global.Promise = require('bluebird');
global.fs = Promise.promisifyAll(require('fs'));

/**
 * 加载配置文件
 */
global.config = require('./config.json');

/**
 * 配置日志
 */
global.log4js = require('log4js');
log4js.configure({
  appenders: [
    {
      type: 'dateFile',
      filename: 'logs/system.log',
      pattern: '-yyyy-MM-dd',
      category: 'system',
    },
    {
      type: 'console',
      category: 'system',
    },
  ],
});

const logger = log4js.getLogger('system');

/**
 * 连接redis数据库
 */
const ioRedis = require('ioredis');
exports.redis = () => {
  return new ioRedis(config.redis);
};
global.redisClient = this.redis();

// 添加日期函数
exports.dateFormat = function (date, format) {
  const formatStrs = {
    'M+': date.getMonth() + 1, // month
    'd+': date.getDate(), // day
    'h+': date.getHours(), // hour
    'm+': date.getMinutes(), // minute
    's+': date.getSeconds(), // second
    'q+': Math.floor((date.getMonth() + 3) / 3), // quarter
    'S': date.getMilliseconds(), // millisecond
  };
  if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  for (const str in formatStrs) {
    if(new RegExp('(' + str + ')').test(format)){
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? formatStrs[str] : ('00' + formatStrs[str]).substr(('' + formatStrs[str]).length));
    }
  }
  return format;
};

// 将字符串转换成指定宽度的16进制字符串
exports.str2Hex = (str, length) => {
  str = parseInt(str, 10).toString(16);
  let count = length - str.length;
  for(let i = 0;i < count;i++) {
    str = '0' + str;
  }
  return str;
};

// 字节数组转十六进制字符串
exports.bytes2Str = (arr) => {
  let str = '';
  for (let i = 0; i < arr.length; i++) {
    let tmp = arr[i].toString(16);
    if (tmp.length === 1) {
      tmp = '0' + tmp;
    }
    str += tmp;
  }
  return str;
};

// 十六进制转二进制数组
exports.hex2BinArr = (hex) => {
  if (typeof hex !== 'number') { logger.error('hex2BinArr 参数必须是数字类型'); return []; }
  // 模
  let m = 0;
  // 被除数
  let dividend = hex;
  // 容器
  const arr = [];

  for (let i = 0; i < 8; i++) {
    m = dividend % 2;
    const num = dividend / 2;
    dividend = parseInt(num, 10);
    num === 1 ? arr.push(0) : arr.push(m);
  }

  return arr;
};

// 验证并解析数据
exports.parseResult = (data) => {
  let recStr = Buffer.from(this.bytes2Str(data)).toString('utf-8');
  // logger.info('原始数据:' + recStr);
  // 解析数据
  const result = {};
  // 起始标志数据同步码
  result.first = 'protocol24';
  // 命令
  result.cmd = recStr.substr(8, 4);
  // 数据
  result.data = recStr.slice(12, recStr.length - 4);
  // 全数据
  result.fulldata = recStr;
  
  return result;
};