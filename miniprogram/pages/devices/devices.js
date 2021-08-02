var plugin = requirePlugin("smartLock")
var app = getApp();
Page({
  data: {
    AppkeyList: [],
    noData: true,
    scrolly: true,   //是否允许滚动
    operateType:1 //1:正常扫描获取信息  2:扫描获取从设备信息
  },

  onLoad: function (options) {
    var that = this;
    that.refreshDeviceList();
    var operateType = options.operateType;    //操作类型，1:正常扫描获取信息  2:扫描获取从设备信息
    if(undefined == operateType){
      operateType = 0;
    }
    operateType = parseInt(operateType)
  },

  refreshDeviceList: function () {
    var that = this
    plugin.scanSmartLock(this.scanDeviceCallBack)
  },
  /**
   * 扫描设备回调
   */
  scanDeviceCallBack: function (res) {
    var that = this;
    var dev = res.data.msg;
    var deviceName = dev.localName;
    console.log("scanDeviceCallBack: "+deviceName);
    var rssi = dev.RSSI;
    var lockId = plugin.parseDeviceId(deviceName);
    var deviceType = plugin.parseDeviceType(deviceName);
    var devName = plugin.parseDeviceName(deviceName);
    var lock = {
      "LOCKID": lockId,
      "RSSI": rssi,
      "DATA": {
        KEYLOCKID: lockId,
        KEYUSERNAME: devName,
        DEVICETYPE: deviceType
      }
    }
    var lockList = that.data.AppkeyList;
    //获取当前设备列表的id列表
    var lockIdList = lockList.map(function (item) {
      return item.LOCKID;
    })
    if (lockIdList.indexOf(lockId) < 0) {
      //验证当前lock是否在列表里,如果不在,则添加
      lockList.push(lock);
    } else {
      //如果在,则更新
      lockList.splice(lockIdList.indexOf(lockId), 1, lock);
    }
    console.log(lockList)
    if (lockList == null || lockList == undefined || lockList.length < 1) {
      that.setData({
        noData: true
      })
    } else {
      that.setData({
        noData: false
      })
    }
    that.setData({
      AppkeyList: lockList
    })
  },

  selectDevice:function(e){
    var that = this;
    var data = e.currentTarget.dataset;
    var lockId = data.lockId;
    var sLockType = data.deviceType;
    var operateType = data.operateType;
    app.globalData.selectedLockId = lockId;
    switch(operateType){
      case 2:{
        let pages = getCurrentPages();
        let prevPage = pages[pages.length - 2];
        prevPage.setData({sLockId:lockId,sLockType:sLockType});
      }break;
    }
    wx.navigateBack()
  }
})