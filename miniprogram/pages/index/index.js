var smartLock = requirePlugin("smartLock")
var app = getApp()

Page({
  data: {
    lockId: '',
    openLockCard: "ABCD1234",
    openLockPsw: "123321",
    openLockFingerprint: "00000002",
    lockPswStartTime: "20161010101010", //2016年10月10号 10点10分10秒
    lockPswEndTime: "20191010101010", //2016年10月10号 10点10分10秒
    lockCardStartTime: "20161010101010", //2016年10月10号 10点10分10秒
    lockCardEndTime: "20191010101010", //2016年10月10号 10点10分10秒
    lockFingerprintStartTime: "20161010101010", //2016年10月10号 10点10分10秒
    lockFingerprintEndTime: "20191010101010", //2016年10月10号 10点10分10秒
    contact: "13812345678",
    pswcontact:"13812345678",
    sLockId:"ABCD1234",
    sLockType:"2",
    switchAutoShutdownDuration:600
  },
  onLoad: function() {
    //初始化插件参数
    wx.setEnableDebug({
      enableDebug: true
  })
    this.initSmartLockPlus();

  },

  scanLock: function() {
    //扫描接口在v1.0.1版本提供
    wx.navigateTo({
      url: '/pages/devices/devices',
    })
  },
  onShow: function(options) {
    var that = this
    var tLockId = ''
    if (null != app.globalData.selectedLockId && '' != app.globalData.selectedLockId) {
      tLockId = app.globalData.selectedLockId
    } else {
      tLockId = "C2482DC4"
    }
    that.setData({
      lockId: tLockId
    })
    if(that.data.sLockId != undefined && that.data.sLockId != ""){
      that.bandLinkDevice(tLockId,that.data.sLockId,that.data.sLockType);
      that.setData({
        sLockId:"",
        sLockType:""
      });
    }
  },

/**初始化参数 */
  initSmartLockPlus: function() {
    var that = this
    //initSmartLock 中需要5个参数，分别为：appid，appkey，二次开发者登陆dms的账号、二次开发者登陆dms的密码，初始化回调函数。前四个参数请微信联系18988768327或者13530382506获取
    smartLock.initSmartLock("928AD3050D4C4E3AB09DE7BEE6A82F41", "794594DA16534A09960031E3E7A89227", "13812345678", "123456", function(res) {
      console.log(res.data)
      if (res.data.result == 0) {
        var tLockId = ''
        if (null != that.data.lockId && '' != that.data.lockId) {
          tLockId = that.data.lockId
        } else {
          tLockId = "C2482DC4"
        }
        if (null != app.globalData.selectedLockId && '' != app.globalData.selectedLockId) {
          tLockId = app.globalData.selectedLockId
        } else {
          tLockId = "C2482DC4"
        }
        that.setData({
          lockId: tLockId
        })
      }
    })
  },

/**蓝牙开锁 */
  openLock: function() {
    //需要initSmartLockPlus回调成功后才有效调用开锁接口
    var tLockId = this.data.lockId
    smartLock.openCloseBleLock(tLockId, 1, function(res) {
      console.error("smartLock openCloseBleLock result: " + JSON.stringify(res.data))
      if (res.data.result == 0) {
        if (null != res.data){
          var openLockData = res.data.data;
          if (null != openLockData){
            console.log("开门记录，锁设备ID： " + openLockData.lockId + " 密码/卡片: " + openLockData.cardPsw.substr(0,8) + " cardPswType:" + openLockData.cardPswType);//cardPswType=2为密码  cardPswType = 3 为IC卡
          }
        }
      }
    })
  },
  /**同步时间 */
  sysTime: function() {
    //需要initSmartLockPlus回调成功后才有效调用同步时钟接口
    var that = this
    smartLock.sysncLockTime(that.data.lockId, function(res) {
      console.error("smartLock sysncLockTime result: " + JSON.stringify(res.data))
    })
  },
  /**读取时间 */
  readTime: function() {
    //需要initSmartLockPlus回调成功后才有效调用同步时钟接口
    var that = this
    smartLock.readLockTime(that.data.lockId, function(res) {
      console.error("smartLock readLockTime result: " + JSON.stringify(res.data))
    })
  },

  /**配置蓝牙模式 */
  batterySwitchChanged: function (e) {
    var that = this;
    var modeValue1 = e.currentTarget.dataset.modeValue1;
    var tLockId = this.data.lockId;
    smartLock.configBleMode(tLockId, modeValue1, function (res) {
      console.error("smartLock batterySwitchChanged result: " + JSON.stringify(res.data));
      if (res.data.result == 0) {
        console.log("配置成功");
      } else {
        console.log("配置失败");
      }
    });
    //that.configLockBatteryMode(modeType, modeValue1, modeValue2);
  },
  /**设置自定义密码 */
  setOpenLockPsw: function (e) {
    var that = this;
    var startTime = that.data.lockPswStartTime;
    var endTime = that.data.lockPswEndTime;
    var tLockId = that.data.lockId;
    var psw = that.data.openLockPsw;
    var contact = that.data.pswcontact;
    console.log("setOpenLockPsw");
    smartLock.setOpenLockPsw(tLockId, psw, startTime, endTime, contact, function (res) {
      if (res.data.result == 0) {
        console.log("下发成功");
      } else {
        console.log("下发失败");
      }
    });
  },

  /**删除密码 */
  delOpenLockPsw: function (e) {
    var that = this;
    var tLockId = that.data.lockId;
    var cardPswType = 2;
    var cardPsw = that.data.openLockPsw;
    console.log("delOpenLockPsw");
    smartLock.delPwdCard(tLockId, cardPsw, cardPswType, function (res) {
      if (res.data.result == 0) {
        console.log("删除密码成功");
      } else {
        console.log("删除密码失败");
      }
    });
  },
  /**学习IC卡 */
  setLockCard: function (e) {
    var that = this;
    var startTime = that.data.lockPswStartTime;
    var endTime = that.data.lockPswEndTime;
    var tLockId = that.data.lockId;
    var psw = that.data.openLockPsw;
    var contact = that.data.contact;
    smartLock.learnLockCard(tLockId, startTime, endTime, contact, function (res) {
      if (res.data.result == 0) {
        console.error(JSON.stringify(res));
        var data = res.data;
        if (null != data && undefined != data && '' != data) {
          if (null != data.operate) {
            if (23 == data.operate) {
              console.log("需要提示用户将IC卡放在门锁刷卡区");
              wx.showToast({
                title: '请将IC卡放在门锁刷卡区进行刷卡',
                icon: "none"
              })
            } else if (46 == data.operate) {
              var cardId = data.resultList[5].substr(0, 8);
              console.log("授权IC卡成功，IC卡的ID为： " + cardId);
              that.setData({
                openLockCard: cardId
              });
              wx.showToast({
                title: '授权成功',
                icon: "none"
              });
            }
          }
        }
      } else {
        console.log("下发失败");
      }
    });
  },

  /**删除IC卡 */
  delLockCard: function (e) {
    var that = this;
    var tLockId = that.data.lockId;
    var cardPswType = 3;
    var cardPsw = that.data.openLockCard;
    console.log("delLockCard");
    smartLock.delPwdCard(tLockId, cardPsw, cardPswType, function (res) {
      if (res.data.result == 0) {
        console.log("删除IC卡成功");
      } else {
        console.log("删除IC卡失败");
      }
    });
  },
  /**学习指纹 */
  learnLockFingerprint: function (e) {
    var that = this;
    var startTime = that.data.lockPswStartTime;
    var endTime = that.data.lockPswEndTime;
    var tLockId = that.data.lockId;
    var psw = '00000000';
    var contact = that.data.contact;
    smartLock.learnLockFingerprint(tLockId, startTime, endTime, contact, function (res) {
      if (res.data.result == 0) {
        console.error(JSON.stringify(res));
        var data = res.data;
        if (null != data && undefined != data && '' != data) {
          if (null != res.data && null != res.data.operate && res.data.operate == 46) {
            wx.showToast({
              title: '授权成功',
              icon: "none"
            });
            var openLockFingerprint = data.resultList[5].substr(0, 8);
            console.log("授权指纹卡成功，指纹的ID为： " + openLockFingerprint);
            that.setData({
              openLockFingerprint: openLockFingerprint
            });
          } else {
            if (parseInt(res.data.cmdStatus) == 0) {
              console.log("提示请放手指");
               wx.showToast({
                 title: '提示请放手指',
                icon: "none"
              });
            } else {
              console.log("提示请再次放手指");
              wx.showToast({
                title: '请在门锁上按下手指第' + (res.data.cmdStatus + 1) + '次录入指纹',
                icon: "none"
              });
            }
          }
        }
      } else {
        console.log("下发失败");
      }
    });
  },
  /**删除指纹 */
  delFingerPrint: function (e) {
    var that = this;
    var tLockId = that.data.lockId;
    var cardPswType = 4;
    var cardPsw = that.data.openLockFingerprint;
    console.log("delOpenLockPsw");
    smartLock.delFingerPrint(tLockId, cardPsw, cardPswType, function (res) {
      if (res.data.result == 0) {
        console.log("删除指纹成功");
      } else {
        console.log("删除指纹失败");
      }
    });
  },
  /**取电开关绑定门锁/红外/门磁 */
  bindLinkDeviceTab:function(e){
    wx.navigateTo({
      url: '/pages/devices/devices?operateType=2',
    })
  },
  bandLinkDevice: function (mLockId,sLockId, sLockType) {
    var that = this;
    console.log("bandLinkDevice");
    smartLock.bandLinkDevice(mLockId,sLockId, sLockType,  function (res) {
      if (res.data.result == 0) {
        console.log("操作成功");
      } else {
        console.log("操作失败");
      }
    });
  },
  changeSwitchTimeMode:function(e){
    var that = this;    
    var switchAutoShutdownDuration = that.data.switchAutoShutdownDuration;
    smartLock.changeSwitchTimeMode(that.data.lockId,5,1,switchAutoShutdownDuration,function(res){
      if (res.data.result == 0) {
        console.log("操作成功");
      } else {
        console.log("操作失败");
      }
    });
  },

  /**恢复出厂 */
  setDefaultDevice: function (e) {
    var that = this;
    var tLockId = that.data.lockId;
    console.log("setDefaultDevice");
    smartLock.setDefaultLock(tLockId,  function (res) {
      if (res.data.result == 0) {
        console.log("恢复出厂成功");
      } else {
        console.log("恢复出厂失败");
      }
    });
  },
  /********更多接口使用和获取请访问 http://wiki.eeun.cn/index.php?s=/20&page_id=108 */
})