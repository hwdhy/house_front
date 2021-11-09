import request from '@/utils/request';

const OpenApi = {
  urls(key = '') {
    return {
      userLogin: `/open/login`,                               //用户登录            ***
      getLimits: `/open/limits`,                              //获取正则表达式       ***
      judgeNickName: `/open/nickName`,                        //判断昵称 
      checkPhoneExist: `/open/phone/exist`,                  //检验手机号码是否存在   ***
      logout: `/user/logout`,                                 //退出用户登录         ***
      getVerifyImage: `/open/verifyImage?phone=`,             //获取图片验证码
      getResetPasswordToken: `/open/getResetPasswordToken`,   //获取重置密码令牌
      resetPasswordByToken: `/open/resetPasswordByToken`,     //通过令牌重置密码
      sendMessage: `/open/sendSmsToPhone`,                    //发送邮件 
      loginInNoPwd: `/open/noPassLogin`,                      //免密登录
      registerPhone: `/open/registryByPhone`,                 //通过手机号码注册
    };
  },
  getLimits() {
    return request({
      url: this.urls().getLimits,
      method: 'get',
      noJweToken: true
    });
  },
  judgeNickName(params: any) {
    return request({
      url: this.urls().judgeNickName,
      method: 'get',
      params
    });
  },
  registerPhone(data: Object) {
    return request({
      url: this.urls().registerPhone,
      method: 'post',
      data,
      noJweToken: true
    });
  },
  loginInNoPwd(data: Object) {
    return request({
      url: this.urls().loginInNoPwd,
      method: 'post',
      data,
      noJweToken: true
    });
  },

  sendMessage(data: any) {
    return request({
      url: this.urls().sendMessage,
      method: 'post',
      data,
      noJweToken: true
    });
  },
  userLogin(data: Object) {
    return request({
      url: this.urls().userLogin,
      method: 'post',
      data,
      noJweToken: true
    });
  },
  checkPhoneExist(phone: string) {
    return request({
      url: this.urls().checkPhoneExist,
      method: 'post',
      noJweToken: true,
      progress: false,
      data: {
        "phone": phone
      }
    });
  },
  getVerifyImage(phone: string) {
    return request({
      url: this.urls().getVerifyImage + phone,
      method: 'get',
      noJweToken: true,
      progress: false
    });
  },
  checkVerifyImage(phone: string, x: number) {
    return request({
      url: `/open/checkImageCode?phone=${phone}&x=${x}`,
      method: 'get',
      noJweToken: true,
      progress: false,
      delStatus: false
    });
  },
  getResetPasswordToken(phoneNumber: string, verifyCode: string) {
    return request({
      url: this.urls().getResetPasswordToken,
      method: 'post',
      noJweToken: true,
      progress: false,
      data: {
        phoneNumber: phoneNumber,
        verifyCode: verifyCode
      }
    });
  },
  resetPasswordByToken(token: string, password: number) {
    return request({
      url: this.urls().resetPasswordByToken,
      method: 'post',
      noJweToken: true,
      progress: false,
      data: {
        token: token,
        password: password
      }
    });
  },
  logout(token) {
    return request({
      url: this.urls().logout,
      method: 'post',
      noJweToken: true,
      progress: false,
      data: {
        token: token,
      }
    });
  },
};

export default OpenApi;
