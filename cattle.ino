#include <SoftwareSerial.h>
SoftwareSerial cardSerial(4, 5); // 电流表数据通讯TTL RX, TX
SoftwareSerial loraSerial(7, 8); // lora通信
int impulse = 0; //脉冲计数
int runstatus = 0; // 状态 0表示空闲,1表示已刷卡正在工作,2表示结束工作正在上传数据
char szTmp[3]; // 串口读取

String cardID = ""; // 卡编号
String tempCardID = ""; 
String serverID = "000104";
String myID = "000204";

void setup() {
  // 调试串口
  Serial.begin(9600);
  // 读卡器串口
  cardSerial.begin(9600);
  // lora通信
  loraSerial.begin(9600);
  // 流量计中断
  attachInterrupt(0, showCount, CHANGE);
}

void loop() {
  if(runstatus == 0) {
    cardSerial.listen();
    while (cardSerial.available() > 0)  
    {
      sprintf( szTmp, "%02X", (unsigned char) cardSerial.read() );
      cardID += szTmp;
      delay(2);
    }
    
    if(cardID.length() > 0 && cardID.indexOf("0D0A") != -1) {
      Serial.println("Read card process start.....");
      impulse = 0;
      runstatus = 1;
    }
  } else if(runstatus == 1) {
    while (cardSerial.available() > 0)  
    {
      sprintf( szTmp, "%02X", (unsigned char) cardSerial.read() );
      tempCardID += szTmp;
      delay(2);
    }
    if(tempCardID.length() > 0 && tempCardID.equals(cardID)) {
      Serial.println("Read card process end.....,send message.....");
      cardSerial.end();
      runstatus = 2;
    } 
    
    tempCardID = ""; 
  } else if(runstatus == 2) {
    Serial.println("begin send message.....");
    String cmd = serverID + "AA3333800001" + cardID + intToHEX(impulse, 4) + myID + "FCFF";
    loraSerial.listen();
    
    delay(100);
    sendCmd(cmd);
    delay(1000);
    
    String resave = "";
    while (loraSerial.available() > 0)  
    {
      sprintf( szTmp, "%02X", (unsigned char) loraSerial.read() );
      resave += szTmp;
      delay(2);
    }
    Serial.println(resave);
    if(resave.equals("FFFF")) {
      cardID = "";
      impulse = 0;
      runstatus = 0;
      loraSerial.end();
      
      Serial.println("sendMessage OK");
    } else {
      Serial.println("sendMessage Error, replay....."); 
    }
  }
}

void showCount() {
  impulse ++;
}

String intToHEX(int num, int len) {
  String temp = String(num, HEX);
  int count = len - temp.length();
  while(count > 0) {
    temp = "0" + temp;
    count --;
  }
  return temp;
}

void sendCmd(String cmd) {
  unsigned char sendchar[1];
  char temp[2];
  for(int i = 0;i < cmd.length();i += 2) {
    temp[0] = cmd[i];
    temp[1] = cmd[i + 1];
    sscanf(temp, "%02X", sendchar);
    loraSerial.write(sendchar, 1);
  }
}
