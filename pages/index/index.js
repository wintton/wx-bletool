
// pages/bleteset/bletest.js
var Bletool = require("../../utils/bletool.js");
var util = require("../../utils/util.js");
var mxDigtial = require('../../utils/mxDigital.js'); 
var bleUtil;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    device: {},   //蓝牙数据
    devicename: 0,
    repdata: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    bleUtil = new Bletool();
    bleUtil.initble(function (res) {
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
              device: devices,
              devicename: num + 1
            });
          }, 10000);
        }, 1000);
      } else {
        wx.showToast({
          title: '请先打开蓝牙',
          icon: "none"
        })
      }
    }, function (res) {
      console.log(res);

    }, function (res) {
      console.log(res);

    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var timeShow = new mxDigtial({
      canvasid: "moneyshow",
      value: "860.000",
      width: getApp().globalData.width,
      height: getApp().globalData.height * 0.4,
      size:20,
      color: "#000"
    })
    timeShow.setBold(2);
    setInterval(function(){ 
      timeShow.setValue(util.formatTime((new Date()))); 
    },1000);
    // drawFont("moneyshow", "15:00", getApp().globalData.width, getApp().globalData.height * 0.4, 20,"#2E98E9");
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if (bleUtil) {
      bleUtil.close();
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  dis: function (res) {
    if (bleUtil) {
      bleUtil.disconnect();
    }
  },
  send: function (res) {
    if (bleUtil) {
      bleUtil.sendMsg("PX-CP#", function (res) {
        console.log(res);
      });
    }
  },
  connect: function (res) {
    var that = this;
    var item = res.currentTarget.dataset.item;
    if (bleUtil) {
      bleUtil.connect(item.deviceId, function (res) {
        console.log(res);
        that.setData({
          repdata: res.value.strData
        });
      });
    }
  }
})
function drawFont(canvasid,value,width,height,size,color){
  const ctx = wx.createCanvasContext(canvasid);
  const fontSpace = 10; //字间距
  const fontoffset = size / 6;        //斜边长度
  const pointSize = size / 4;         //小数点字体大小
  const length = (value + "").length;  //字体数
  const fontGap = 2;              //数码管间隙
  const fontWidth = 10;   //字宽度
  const allFontLength = length * size + (length - 1) * fontSpace;  //字体总长度
  var pointWidth = 0;        //点的间距
  var j = 0;

  for(var i = 0; i < length;i++){
    //先计算开始画图的坐标  
    var startX = 0;
    if (pointWidth == 0){
       startX = width / 2 - allFontLength / 2 + (size + fontSpace) * i + pointWidth;
    }else{
       startX = width / 2 - allFontLength / 2 + (size + fontSpace) * (i - 1) + pointWidth;
    }
   
    var startY = height / 2 - size;

    let data = (value + "").charAt(i);
     
    switch(data){
      case "0":{
        drawText(["1","1","1","1","1","1","0"], startX, startY);
      }
      break;
      case "1": {
        drawText(["0", "0", "1", "1", "0", "0", "0"], startX, startY);
      }
        break;
      case "2": {
        drawText(["0", "1", "1", "0", "1", "1", "1"], startX, startY);
      }
        break;
      case "3": {
        drawText(["0", "1", "1", "1", "1", "0", "1"], startX, startY);
      }
        break;
      case "4": {
        drawText(["1", "0", "1", "1", "0", "0", "1"], startX, startY);
      }
        break;
      case "5": {
        drawText(["1", "1", "0", "1", "1", "0", "1"], startX, startY);
      }
        break;
      case "6": {
        drawText(["1", "1", "0", "1", "1", "1", "1"], startX, startY);
      }
        break;
      case "7": {
        drawText(["0", "1", "1", "1", "0", "0", "0"], startX, startY);
      }
        break;
      case "8": {
        drawText(["1", "1", "1", "1", "1", "1", "1"], startX, startY);
      }
        break;
      case "9": {
        drawText(["1", "1", "1", "1", "1", "0", "1"], startX, startY);
      }
      case ".": {
        drawPoint(startX, startY);
        pointWidth = fontSpace + pointSize;
      }
      case ":": {
        drawDoublePoint(startX, startY);
        pointWidth = fontSpace + pointSize;
      }
        break;
    } 
  }
  ctx.draw();
  function drawPoint(startX, startY){
    ctx.setFillStyle(color); 
    ctx.beginPath(); 
    ctx.moveTo(startX, startY + 2 * size);
    ctx.lineTo(startX + pointSize, startY + 2 * size);
    ctx.lineTo(startX + pointSize, startY + 2 * size + pointSize);
    ctx.lineTo(startX, startY + 2 * size + pointSize);
    ctx.lineTo(startX , startY + 2 * size);
    ctx.fill();
  }
  function drawDoublePoint(startX, startY) {
    ctx.setFillStyle(color);
    let up = 0.233;
    let down = 0.766;
    ctx.beginPath();
    ctx.moveTo(startX, startY + 2 * size * up);
    ctx.lineTo(startX + pointSize, startY + 2 * size * up);
    ctx.lineTo(startX + pointSize, startY + 2 * size * up + pointSize);
    ctx.lineTo(startX, startY + 2 * size * up + pointSize);
    ctx.lineTo(startX, startY + 2 * size * up);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(startX, startY + 2 * size * down);
    ctx.lineTo(startX + pointSize, startY + 2 * size * down);
    ctx.lineTo(startX + pointSize, startY + 2 * size * down + pointSize);
    ctx.lineTo(startX, startY + 2 * size * down + pointSize);
    ctx.lineTo(startX, startY + 2 * size * down);
    ctx.fill();
  }
  function drawText(datas,startX,startY){
    var info = [{},{},{},{},{},{},{}];
    //0 从竖线左上第一个开始为0 然后顺时针为 1 - 5， 中间为 6
    info["0"].topLeftX = startX;
    info["0"].topLeftY = startY;
    info["0"].topRightX = startX + fontoffset;
    info["0"].topRightY = startY + fontoffset;
    info["0"].bottomLeftX = startX;
    info["0"].bottomLeftY = startY + size;
    info["0"].bottomRightX = startX + fontoffset;
    info["0"].bottomRightY = startY + size - fontoffset;

    //1
    info["1"].topLeftX = startX;
    info["1"].topLeftY = startY - fontGap;
    info["1"].topRightX = startX + size;
    info["1"].topRightY = startY - fontGap;
    info["1"].bottomLeftX = startX + fontoffset;
    info["1"].bottomLeftY = startY + fontoffset - fontGap;
    info["1"].bottomRightX = startX + size - fontoffset;
    info["1"].bottomRightY = startY + fontoffset - fontGap;

    //2
    info["2"].topLeftX = startX + size - fontoffset;
    info["2"].topLeftY = startY + fontoffset;
    info["2"].topRightX = startX + size;
    info["2"].topRightY = startY;
    info["2"].bottomLeftX = startX + size - fontoffset;
    info["2"].bottomLeftY = startY + size - fontoffset;
    info["2"].bottomRightX = startX + size;
    info["2"].bottomRightY = startY + size;

    //3
    info["3"].topLeftX = startX + size - fontoffset;
    info["3"].topLeftY = startY + size + 2 * fontGap + fontoffset;
    info["3"].topRightX = startX + size;
    info["3"].topRightY = startY + size + 2 * fontGap;
    info["3"].bottomLeftX = startX + size - fontoffset;
    info["3"].bottomLeftY = startY + 2 * size + 2 * fontGap - fontoffset;
    info["3"].bottomRightX = startX + size;
    info["3"].bottomRightY = startY + 2 * size + 2 * fontGap;

    //4
    info["4"].topLeftX = startX + fontoffset;
    info["4"].topLeftY = startY + 2 * size + 3 * fontGap - fontoffset;
    info["4"].topRightX = startX + size - fontoffset;
    info["4"].topRightY = startY + 2 * size + 3 * fontGap - fontoffset;
    info["4"].bottomLeftX = startX;
    info["4"].bottomLeftY = startY + 2 * size + 3 * fontGap ;
    info["4"].bottomRightX = startX + size;
    info["4"].bottomRightY = startY + 2 * size + 3 * fontGap;

    //5
    info["5"].topLeftX = startX;
    info["5"].topLeftY = startY +  size + 2 * fontGap;
    info["5"].topRightX = startX + fontoffset;
    info["5"].topRightY = startY +  size + 2 * fontGap + fontoffset;
    info["5"].bottomLeftX = startX;
    info["5"].bottomLeftY = startY + 2 * size + 2 * fontGap;
    info["5"].bottomRightX = startX + fontoffset;
    info["5"].bottomRightY = startY + 2 * size + 2 * fontGap - fontoffset; 

    //6
    info["6"].topLeftX = startX + fontoffset / 2;
    info["6"].topLeftY = startY + size - fontoffset / 2 + fontGap;
    info["6"].topRightX = startX + size - fontoffset / 2;
    info["6"].topRightY = startY + size - fontoffset  / 2 + fontGap;
    info["6"].bottomLeftX = startX + fontoffset / 2;
    info["6"].bottomLeftY = startY + fontoffset / 2 + size + fontGap;
    info["6"].bottomRightX = startX + size - fontoffset / 2;
    info["6"].bottomRightY = startY + size + fontGap + fontoffset / 2;
    info["6"].centerLeftX = startX;
    info["6"].centerLeftY = startY + size + fontGap;
    info["6"].centerRightX = startX + size;
    info["6"].centerRightY = startY + size + fontGap;
    
    for(var x in datas){ 
      if (datas[x] == "1"){
        ctx.setFillStyle(color); 
      }else{
        ctx.setFillStyle("#E6E6E6"); 
      } 
    
      ctx.beginPath();
      if(x  == 6){
        ctx.moveTo(info[x].centerLeftX, info[x].centerLeftY);
        ctx.lineTo(info[x].topLeftX, info[x].topLeftY);
        ctx.lineTo(info[x].topRightX, info[x].topRightY);
        ctx.lineTo(info[x].centerRightX, info[x].centerRightY);
        ctx.lineTo(info[x].bottomRightX, info[x].bottomRightY);
        ctx.lineTo(info[x].bottomLeftX, info[x].bottomLeftY);
        ctx.lineTo(info[x].centerLeftX, info[x].centerLeftY);
      }else{ 
        ctx.moveTo(info[x].topLeftX, info[x].topLeftY);
        ctx.lineTo(info[x].topRightX, info[x].topRightY); 
        ctx.lineTo(info[x].bottomRightX, info[x].bottomRightY);
        ctx.lineTo(info[x].bottomLeftX, info[x].bottomLeftY);
        ctx.lineTo(info[x].topLeftX, info[x].topLeftY);
      }
      ctx.fill();  
    } 
  }
}