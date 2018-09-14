
// pages/bleteset/bletest.js
var Bletool = require("../../utils/bletool.js");

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