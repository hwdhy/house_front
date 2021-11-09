import request from '@/utils/request';

const AddressApi = {
    getSupportCities() {
        return request({
            url: `/address/support/cities`,     //获取城市列表     ****
            method: 'get',
            noJweToken: true
        });
    },

    getSupportRegions(cityEnName: string) {
        return request({
            url: `/address/support/regions/${cityEnName}`,   //获取城市下的所有区县    *******
            method: 'get',
            noJweToken: true
        });
    },
}

export default AddressApi;
