#include <SoftwareSerial.h>

SoftwareSerial rolaSerial(2, 3); // 电流表数据通讯TTL RX, TX
String cmdBuffer = ""; // 命令缓存
int loggerLevel = 1; // 日志级别
char szTmp[3]; // 串口读取
unsigned char channel = 0x04; // 信道

void setup() {
  Serial.begin(9600);
  rolaSerial.begin(9600);
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  // 读取串口指令到buffer
  if(rolaSerial.available() > 0) {
    digitalWrite(LED_BUILTIN, HIGH);
  }
  while (rolaSerial.available() > 0)  
  {
    sprintf( szTmp, "%02X", (unsigned char) rolaSerial.read() );
    cmdBuffer += szTmp;
    delay(2);
  }
  digitalWrite(LED_BUILTIN, LOW);
  
  if(cmdBuffer.length() > 0) {
    parseBuffer();
  }
}

void parseBuffer() {
  // 长度超过2048,清空
  if(cmdBuffer.length() > 2048) {
    cmdBuffer = "";
    logger("size out 2048");
    return;
  }
  
  // 查找AA333380
  int start = cmdBuffer.indexOf("AA333380");
  if(start > 0) {
    cmdBuffer = cmdBuffer.substring(start);
  } else if(start == -1) {
    return;
  }
  
  // 查找FCFF
  String temp = "";
  int end = cmdBuffer.indexOf("FCFF");
  if(end != -1) {
    temp = cmdBuffer.substring(0, end + 4);
    cmdBuffer = cmdBuffer.substring(end + 4);
    sendReturn();
  }
  
  String cmdstr = temp.substring(8, 12);
  String data = temp.substring(12, temp.length() - 4);
  if(cmdstr.equals("0001")) {
    logger(data);
  }
}

// 收到信息号响应
void sendReturn() {
  unsigned char dest[11] = {0x00, 0x01, channel, 0xBB, 0x66, 0x66, 0x80, 0xFF, 0xFF, 0xFc, 0xFF};
  rolaSerial.write(dest, 11);
}

void logger(String str) {
  if(loggerLevel) {
    Serial.println(str); 
  }
}
