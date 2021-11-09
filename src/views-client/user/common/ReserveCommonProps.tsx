import React from "react";
import styled from "styled-components";
import { HouseInfoColumnComponent } from "@views-client/user/user-center/star";
import Tools from "@utils/tools";
import moment from "moment";

/**
 * 我的约看页面
 */
const ReserveCommonProps = {
    columns: (searchParams) => ([
        {
            title: '房源信息',
            dataIndex: 'house',
            key: 'house',
            width: 370,
            render: (record) => <HouseInfoColumnComponent data={record} />,
        },
        {
            title: '价格',
            dataIndex: 'price',
            key: 'price',
            align: "center" as "center",
            width: 100,
            render: value => <span>{value}元/月</span>,
        },
        {
            title: '约看时间',
            dataIndex: 'orderTime',
            key: 'orderTime',
            align: "center" as "center",
            sorter: true,
            sortOrder: searchParams.orderBy === 'orderTime' && Tools.sortDirectionMap(searchParams.sortDirection),
        },
        {
            title: '约看描述',
            dataIndex: 'description',
            key: 'description',
            align: "center" as "center",
            width: 100,
            ellipsis: true
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            align: "center" as "center",
            sorter: true,
            sortOrder: searchParams.orderBy === 'createTime' && Tools.sortDirectionMap(searchParams.sortDirection),
        }
    ]),
    dataSource: (list) => {
        if (list?.length > 0) {
            return list.map((item: any) => ({
                key: item.houseSubscribe?.id,
                house: item.house,
                price: item.house.price,
                orderTime: item.houseSubscribe?.orderTime ? moment(item.houseSubscribe?.orderTime).format("YYYY/MM/DD") : "需沟通",
                description: item.houseSubscribe?.description || "无",
                createTime: moment(item.houseSubscribe?.createTime).fromNow(),
                lastUpdateTime: moment(item.houseSubscribe?.lastUpdateTime).fromNow(),
                telephone: item.houseSubscribe.telephone,
                user: item.user,
                agent: item.agent
            }));
        }

    },
};

export default ReserveCommonProps;
