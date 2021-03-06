'use strict';

// 解析串口回传数据
exports.parseData = Promise.coroutine(function* (result) { 
  switch (result.cmd) {
    case '0001': {
      let obj = {};
      obj.cardid = result.data.slice(0, 24);
      obj.count = parseInt(result.data.slice(24, 28), 16);
      obj.num = parseInt(obj.count * 1000 / 600); // ml
      obj.name = result.data.slice(28, 34);
      obj.update = util.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss");
      console.log(obj);

      if(SocketIO) {
        SocketIO.emit("TON_update", obj);
      }
      serialPort.write(Buffer.from(obj.name + "FF", "hex"));
      break;
    }
    default:
      break;
  }
});