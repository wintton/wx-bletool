/**
 * 蓝牙集成 插件
 * 2018-09-13  wintton 
 */ 

  var Until = {  
    getBleService(re) {
      wx.getBLEDeviceServices({ 
        deviceId: data.connectedDeviceId,
        success: function (res) { 
          for (var i = 0; i < res.services.length; i++) {
            if (res.services[i].uuid.indexOf("0000FFF0") != -1) { 
              data.services = res.services[i].uuid;
              getChar(re);
            }
          }
        }
      })
    },    
  }
  var data = {
    status: 0, //可用状态 1 - 可用 0 - 不可用
    sousuo: 0, //搜索状态 1 - 搜索中  0 - 为搜索
    connectedDeviceId: "", //已连接设备uuid
    services: "", // 连接设备的服务
    characteristics: "",   // 连接设备的状态值
    writeServicweId: "", // 可写服务uuid
    writeCharacteristicsId: "",//可写特征值uuid
    readServicweId: "", // 可读服务uuid
    readCharacteristicsId: "",//可读特征值uuid
    notifyServicweId: "", //通知服务UUid
    notifyCharacteristicsId: "", //通知特征值UUID
    inputValue: "",
    characteristics1: "", // 连接设备的状态值
    isOpenadatper:false,   //是否初始化蓝牙适配器
    connectStatus: false ,   //连接状态
    onNotifyChange:function () {},
  }

function ab2hex(buffer) {
  var hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join('');
}
function strToHexCharCode(str) {
  if (str === "")
    return "";
  var hexCharCode = [];
  hexCharCode.push("0x");
  for (var i = 0; i < str.length; i++) {
    hexCharCode.push((str.charCodeAt(i)).toString(16));
  }
  return hexCharCode.join("");
}
function opennotify(notify_id, re){
  //开启通知 
  wx.notifyBLECharacteristicValueChange({
    state: true,
    deviceId: data.connectedDeviceId,
    serviceId: data.services,
    characteristicId: notify_id,
    success: function (res) {
      console.log('notifyBLECharacteristicValueChange success', res.errMsg)


      wx.onBLECharacteristicValueChange(function (res) {
        let msg = ab2hex(res.value);
        res.value.strData = msg;
        console.log(res);
        re(res);//接受消息  
      })
    }
  })
}
function getChar(re){
  //获取特征值
  wx.getBLEDeviceCharacteristics({
    deviceId: data.connectedDeviceId,
    serviceId: data.services,
    success: function (res) {
      let notify_id, write_id, read_id;
      for (let i = 0; i < res.characteristics.length; i++) {
        let charc = res.characteristics[i];
        if (charc.properties.notify) {
          notify_id = charc.uuid;
        }
        if (charc.properties.write) {
          write_id = charc.uuid;
        }
        if (charc.properties.read) {
          read_id = charc.uuid;
        }
      } 
      if (notify_id != null && write_id != null) {
        data.notifyCharacteristicsId = notify_id;
        data.writeCharacteristicsId = write_id;
        data.readCharacteristicsId = read_id;
        opennotify(notify_id, re);
      }
    }
  })
}
//蓝牙使用类
class bletool{  
  /**
  * 构造函数
  * 
  * @param {Object} options 接口参数,key 为必选参数
  */
  constructor() {
  }
  /**
   * 获得蓝牙适配器状态
   */
  getAdapterStatus(){ 
    return data.isOpenadatper;
  }
  /**
   * 初始化蓝牙
   * @parameter chcb  蓝牙状态改变回调
   * @parameter concb 蓝牙连接状态改变回调
   * @parameter recb  初始化成功与否回调
   */
  initble(recb,chcb,concb){ 
    //打开适配器 判断是否支持蓝牙 
    var info = {
      return_code : "1",
      msg:""
    }
    if (wx.openBluetoothAdapter){  
       wx.openBluetoothAdapter({
        success: function (res) {
          /**
           * 监听蓝牙适配器状态
           */
          data.isOpenadatper = true;
          info.return_code = "0";
          info.msg = "初始化成功！";
          recb(info);
          console.log(res);
          wx.onBluetoothAdapterStateChange(
            function(res){
              if(typeof chcb == "function"){
                chcb(res);
              }
             data.sousuo = res.discovering ? 1 : 0,
             data.status =  res.available ? 1 : 0 
             }
          );
          /**
          * 获取本机蓝牙适配器状态
          */
          wx.getBluetoothAdapterState({
            success: function (res) { 
              data.sousuo = res.discovering ? 1 : 0,
              data.status = res.available ? 1 : 0 
            }
          });
          /**
           * 监听蓝牙状态状态
           */
          wx.onBLEConnectionStateChange(
            function(res){
              concb(res);
              data.connectedDeviceId = res.deviceId;
              data.connectStatus = res.connected;
          }) 
          return true;
        },
        fail: function (res) {
          info.return_code = "1";
          info.msg = "初始化失败！";
          recb(info);
          data.isOpenadatper = false;
         
        }
      }); 
    }else{
      info.return_code = "1";
      info.msg = "初始化失败！";
      recb(info);
      data.isOpenadatper = false; 
    } 
  }

 /**
  * 开始扫描
  *@parameter getDevCb - 发现设备回调   endTime 扫描结束时间
  *@return info{return_code:"0",msg:"",rep:{}} 
  *return_code 返回操作结果  msg - 返回操作信息 rep - 扫描到的蓝牙设备信息
  */
  startScanle(getDevCb,endTime){
    var info = {
      return_code: "1",
      msg:"",
      rep:{}
    }
    if(data.sousuo == 1){
      info.return_code = "1";
      info.msg = "正在搜索中..."
    }else{
      wx.startBluetoothDevicesDiscovery({
        success: function(res) {
          info.return_code = "0";
          info.msg = "搜索成功"; 
          wx.onBluetoothDeviceFound(
            function(res){
              if (typeof getDevCb == "function"){
                getDevCb(res);
             }
          })
        },
      })
      setTimeout(function(res){
        wx.stopBluetoothDevicesDiscovery({
          success: function (res) {
          },
          fail: function (res) {
          }
        }) 
      }, endTime);
    }
    return info;
  }
  /**
   * 停止扫描
   * @return true  - 成功 false - 失败
   */
  stopScanle(){
    wx.stopBluetoothDevicesDiscovery({
      success: function(res) { 
      },
      fail: function(res){ 
      }
    }) 
  } 
  /**
   * 连接设备，连接超时时间3秒
   * @parameter id - 设备id readCb - 设备接收数据回调
   * @return true  - 成功 false - 失败
   */
  connect(id,readCb){   
    var info = {
      return_code: "1",
      msg: "" 
    } 
    if (data.connectStatus) {
      info.return_code = "1";
      info.msg = "当前已连接！"; 
    } else {
      wx.showLoading({
        title: '连接蓝牙设备中...',
      })
      wx.createBLEConnection({
        deviceId:id,
        timeout:3000,
        success: function (res) {
          wx.hideLoading();
          data.connectStatus = true;
          data.connectedDeviceId = id;
          wx.showToast({
            title: '连接成功',
            icon: 'success',
            duration: 1000
          })
          info.return_code = "0";
          info.msg = "连接设备成功"; 
          console.log("连接设备成功")
          //获取服务 
          if (typeof readCb == "function") {
            Until.getBleService(readCb); 
          }
      
        },
        fail: function (res) {
          wx.hideLoading()
          wx.showToast({
            title: '连接设备失败',
            icon: 'success',
            duration: 1000
          })
          info.return_code = "1";
          info.msg = "连接设备失败"; 
          console.log("连接设备失败")
          console.log(res)
          data.connectStatus = false;
        }
      })
      wx.stopBluetoothDevicesDiscovery({
        success: function (res) {
          console.log("停止蓝牙搜索")
          console.log(res)
        }
      })
    }  
    return info;
  }
  /**
   *像蓝牙涉笔蓝牙发送数据
   * msg - 发送的消息   sendab  - 发送结果回调
   */
  sendMsg(msg,sendab) { 
    var info = {
      return_code: "1",
      msg: "发送失败！"
    } 
    var hexs = strToHexCharCode(msg);
  var typedArray = new Uint8Array(hexs.match(/[\da-f]{2}/gi).map(function (h) {
    return parseInt(h, 16);
  }));
  var buffer1 = typedArray.buffer;

  wx.writeBLECharacteristicValue({
    deviceId:  data.connectedDeviceId,
    serviceId:  data.services,
    characteristicId: data.writeCharacteristicsId,
    value: buffer1,
    success: function (res) {
      info.return_code = "0";
      info.msg = "发送成功";
      if (typeof sendab == "function"){
        sendab(info);
      }
      wx.showToast({
        title: '发送成功',
      })
    },
    fail:function(res){
      if (typeof sendab == "function") {
        sendab(info);
      }
    }
  })
  return info;
}
  /**
   * 断开连接
   *@return info{return_code:"0",msg:""} return_code 返回操作结果  msg - 返回操作信息
   */
  disconnect(){
    var info = {
      return_code: "1",
      msg: ""  
    }
    if(data.connectStatus){
      wx.closeBLEConnection({
        deviceId: data.connectedDeviceId,
        success: function(res) {
          info.return_code = "0";
          info.msg = "断开成功";
        },
      })
    }else{
      info.return_code = "1";
      info.msg = "未连接任何设备";
    }
    return info;
  }
  /**
   * 关闭适配器
   */
  close(){
    var info = {
      return_code: "1",
      msg: "关闭失败"
    }
    wx.closeBluetoothAdapter({
      success: function(res) {
        info.return_code = "0";
        info.msg = "关闭成功！"
      },
    })
    return info;
  } 
}
module.exports = bletool;