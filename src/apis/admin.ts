import request from '@/utils/request';

const AdminApi = {
  urls() {
    return {
      getHouseList: `/admin/houses`,                 //后台房源列表    ***
      uploadPhoto: `/admin/house/upload/photo`,      //上传图片      ***
      addHouses: `/admin/house/add`                  //新增房源     ****
    };
  },
  getHouseList(data: Object) {
    return request({
      url: this.urls().getHouseList,              //后台房源列表    ***
      method: 'post',
      data,
    });
  },
  uploadPhoto(file: Blob) {
    const form = new FormData();
    form.append('file', file);
    return request({
      url: `/admin/house/upload/photo`,           //上传图片      ***
      method: 'post',
      data: form
    });
  },
  addHouse(houseForm) {
    return request({
      url: `/admin/house/add`,               //新增房源     ****
      method: 'post',
      data: houseForm
    });
  },
  getEditHouse(houseId) {
    return request({
      url: `/admin/house/get`,            //获取编辑房源信息   *********
      method: "post",
      delStatus: false,
      data: {
        "houseId": houseId
      },
    })
  },
  updateHouse(houseForm) {
    return request({
      url: `/admin/house/update`,         //更新房源信息   ***
      method: "post",
      data: houseForm
    })
  },
  updateHouseStatus(houseId: number, status: number) {
    return request({
      url: `/admin/house/operate`,        //后台房源操作    ***
      method: "post",
      data: {
        "houseId": houseId,
        "status": status,
      },
    })
  },
  getReserveData(data) {
    return request({
      url: `/admin/house/subscribes`,           //获取预约数据            ***
      method: "post",
      data: data
    })
  },
  cancelReserve(reserveId: number) {
    return request({
      url: `/admin/house/subscribe/delete`,      //删除预约数据       ***
      method: "post",
      data: {
        "reserveId": reserveId
      }
    })
  },
  updateHouseReserveStatus(reserveId: number, status: (2 | 3)) {
    return request({
      url: `/admin/house/subscribe/update`,        //预约数据修改      ***
      method: "post",
      data: {
        "reserveId": reserveId,
        "status": status,
      }
    })
  }
};
export default AdminApi;
