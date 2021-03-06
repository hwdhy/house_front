import request from '@/utils/request';

const base = '/baiduApi';

const ACCESS_KEY = "r5Gvr4jWyNnn6YSV9LvEwGHTBysodg5n";

const BaiduApi = {

    getCurrentCity() {
        return request({
            url: `${base}/location/ip?ak=${ACCESS_KEY}`,   // 获取当前城市信息
            method: 'get',
            noJweToken: true
        });
    },
    // 获取地址提示
    getAddressHint(keyword: string, city: string, page_num = 0, page_size = 10) {
        return request({
            url: `${base}/place/v2/suggestion?ak=${ACCESS_KEY}&output=json&city_limit=true&region=${city}&query=${keyword}&page_num=${page_num}&page_size=${page_size}`,
            method: 'get',
            noJweToken: true,
            progress: false
        })
    }
};

export default BaiduApi;
