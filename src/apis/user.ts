import request, { requestWithoutDealStatus } from '@/utils/request';


const UserApi = {
  urls(key = '') {
    return {
      getUserInfo: `/user`,                          //获取用户信息  ***
      test: `/address/support/cities`,               //获取支持的城市 ***
      postImage: `/user/avatar/img`,
      removeUserLogo: `/user/avatar`,
      updateUserInfo: `/user/update`,                 //更改用户信息      ***
      uploadPhoto: `/user/upload/photo`,              //用户上传图片      ****
      starHouse: `/user/house/star`,                    //用户收藏房源      ***
      cancelStarHouse: `/user/house/unstar`,            //用户取消收藏房源   ***
      getUserStarHouseList: `/user/house/star/list`,   //用户收藏房源列表    ***
      reserveHouse: `/user/house/subscribe`,           //用户预约看房       ***
      getReserveHouseList: `/user/house/subscribes`,     //用户预约看房列表  ***
      cancelReserveHouse: `/user/house/subscribe/delete`, //用户取消预约看房  ***
    };
  },
  updateUserInfo(data: Object) {
    return request({
      url: this.urls().updateUserInfo,
      method: 'post',
      data,
    });
  },
  removeUserLogo() {
    return request({
      url: this.urls().removeUserLogo,
      method: 'delete',
    });
  },
  postImage(data: Object) {
    return request({
      url: this.urls().postImage,
      method: 'put',
      data,
    });
  },
  getUserInfo() {
    return request({
      url: this.urls().getUserInfo,
      method: 'get',
    });
  },
  test() {
    return request({
      url: this.urls().test,
      method: 'get',
    });
  },
  clientGetUserInfo() {
    return request({
      url: this.urls().getUserInfo,
      method: 'get',
      delStatus: false
    });
  },
  starHouse(houseId) {
    return request({
      url: this.urls().starHouse,
      method: "post",
      data: {
        "houseId": houseId
      }
    })
  },
  cancelStarHouse(houseId) {
    return request({
      url: this.urls().cancelStarHouse,
      method: "post",
      data: {
        "houseId": houseId
      }
    })
  },
  getUserStarHouseList(data) {
    return request({
      url: this.urls().getUserStarHouseList,
      method: "post",
      data: data
    })
  },
  reserveHouse(data) {
    return request({
      url: this.urls().reserveHouse,
      method: "post",
      data: data
    })
  },
  getReserveHouseList(data) {
    return request({
      url: this.urls().getReserveHouseList,
      method: "post",
      data: data
    })
  },
  cancelReserveHouse(subscribeId) {
    return request({
      url: this.urls().cancelReserveHouse,
      method: "post",
      data: {
        "subscribeId": subscribeId
      }
    })
  },
  uploadPhoto(file) {
    const form = new FormData();
    form.append('file', file);
    return request({
      url: this.urls().uploadPhoto,
      method: 'post',
      data: form
    });
  },
};
export default UserApi;
