import request from '@/utils/request';
import { CancelTokenSource } from 'axios'

interface HouseSearchForm {
  keyword?: string,
  cityEnName: string,
  regionEnName?: string,
  subwayLineId?: number,
  subwayStationId?: number,
  rentWay?: number,
  priceMin?: number,
  priceMax?: number,
  tags?: Array<String>,
  page?: number,
  pageSize?: number,
  orderBy?: string,
  sortDirection?: string,
  areaMin?: number,
  areaMax?: number,
}
// 地图房源表单查询
interface MapHouseSearchForm {
  cityEnName: string,
  regionEnName?: string,
  rentWay?: number,
  priceMin?: number,
  priceMax?: number,
  tags?: Array<String>,
  page?: number,
  pageSize?: number,
  orderBy?: string,
  sortDirection?: string,
  bounds?: MapBounds
}
// 地图视野范围
interface MapBounds {
  leftTopLongitude: number,
  leftTopLatitude: number,
  rightBottomLongitude: number,
  rightBottomLatitude: number,
}

const HouseApi = {

  getHouseList(searchData: HouseSearchForm, cancelToken?: CancelTokenSource) {
    return request({
      url: `/house/houses`,      // 房屋列表搜索    ***   
      method: 'post',
      data: searchData,
      cancelToken: cancelToken?.token,
      noJweToken: true
    });
  },

  // // 房源聚合
  // getMapRegions(params) {
  //   return request({
  //     url: `/house/map/${params.cityEnName}/regions`,
  //     method: 'get',
  //     params,
  //     noJweToken: true
  //   });
  // },

  getAutoComplete(prefix: string) {
    return request({
      url: `/house/search/autocomplete`,     // 搜索提示            ***
      method: "post",
      data: {
        prefix: prefix,
      },
      progress: false,
      noJweToken: true
    })
  },
  getHouseById(id: number) {
    return request({
      url: `/house/${id}`,             // 通过房源id获取房源信息       ***
      method: "get",
      progress: true,
      noJweToken: true,
      delStatus: false
    })
  },
  // 地图找房获取房源信息
  mapSearchHouseList(searchData: MapHouseSearchForm) {
    return request({
      url: `/house/map/city/houses`,         //   **********
      method: 'post',
      data: searchData,
      noJweToken: true
    });
  },
  // 城市房源聚合
  mapCityHouseAgg(cityEnName: string) {
    return request({
      url: `/house/map/regions/get`,      //获取房源信息   **********
      method: 'post',
      noJweToken: true,
      data: {
        "cityEnName": cityEnName
      }
    });
  },
  findAllByIds(houseIdList) {
    return request({
      url: `/house/houses/ids`,       //id集合查询房源信息         *******
      method: 'post',
      noJweToken: true,
      data: {
        houseIdList: houseIdList
      }
    });
  }
};

export default HouseApi;
