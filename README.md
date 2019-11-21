# wx-bletool
微信小程序蓝牙集成，可直接调用
<h1>微信小程序蓝牙操作</h1>
<p>由于开发要求，要在微信小程序加上蓝牙操作，于是乎就自己写了个封装了个蓝牙插件bletool，方便自己以后使用，下面介绍一下使用方法和反馈参数</p>
<h4>先来看初始化</h>
<p>集成之后蓝牙的操作就变得简单很多了，先把写好的bletool.js放到utils包下（具体放哪看你们自己的了）</p>

```
var Bletool  = require("../../utils/bletool.js");  //引进js
```
<p>初始化操作，调用initble方法，第一个参数是初始化成功的回调，回调内容为一个json{return_code ： “”，msg：“”} return_code:为0时为成功，msg返回的是操作信息，初第二个参数为蓝牙状态改变的回调，回传参数和官方的没有差异，第三个参数为蓝牙连接状态改变的回调，回传参数与官方的一致</p>
<p>扫描蓝牙，调用startScanle方法，第一个参数为发现新设备的回调，回调参数为新的设备信息，第二个参数为扫面结束时间，我这里设置的是10秒结束，要注意的是初始化后要等待1秒左右才去扫描才行</p>

```
  bleUtil = new Bletool();    
    bleUtil.initble(function(res){
      console.log(res);
      if (res.return_code == "0") {
        setTimeout(function (res) {
          bleUtil.startScanle(function (res) {
            console.log(res);
            var devices = that.data.device;
            var num = that.data.devicename;
            devices[num] = res.devices; 
            console.log(devices);
            that.setData({
              device:devices,
              devicename: num+1
            });
          },10000);
        }, 1000);
      } else {
        wx.showToast({
          title: '请先打开蓝牙',
          icon: "none"
        })
      }   
    },function(res){
      console.log(res); 

    },function(res){
      console.log(res);

    });
```
<p>停止扫描,调用stopScanle()方法即可</p>

```
  bleUtil.stopScanle();
```
<p>连接设备,调用connect()，两个参数 ，第一个参数为蓝牙设备的设备id，第二个参数为接收蓝牙设备回传信息的回调，与官方onBLECharacteristicValueChange回传值一样，新增res.value.strData 为字符串的信息</p>

```
 bleUtil.connect(item.deviceId,function(res){
        console.log(res);
        that.setData({
          repdata: res.value.strData
        });
      });
```
<p>断开连接，调用disconnect()方法即可，返回参数为{return_code：“”，msg}
return_code 为0时为操作成功，msg为具体信息</p>

```
bleUtil.disconnect();
```
<p>发送数据，调用sendMsg()方法，2个参数，第一个为发送的信息，第二个参数为发送回调，返回参数为{return_code：“”，msg}
return_code 为0时为操作成功，msg为具体信息</p>

```
 bleUtil.sendMsg("PX#",function(res){
        console.log(res);
      });
```
<p>然后不用了关闭适配器就over了，调用close()方法即可，很方便吧</p>

```
 if(bleUtil != null){
      bleUtil.close();
    }
```
<p>2019年05月23日 新增接收数据返回hex格式和字符串格式，扫描返回的结果里增加了一个对广播包进行处理后的hexvalue，可自定义uuid,调用方法setUUid（）；即可</p>
