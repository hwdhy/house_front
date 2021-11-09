import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Prompt, useHistory } from "react-router";
import { Button, Col, DatePicker, Empty, Form, Input, notification, Row, Select, Spin, Tag } from "antd";
import { handleResponse } from "@utils/handle-reponse";
import AddressApi from "@apis/address";
import { HouseDirectionList, HouseTagList, HouseFloorList } from "@base/HouseBaseEntity";
import moment from "moment";
import PictureUploader from "@components/PictureUploader";
import { useDispatch, useSelector } from 'react-redux'
import AdminApi from "@apis/admin";

const { Option } = Select;
const { CheckableTag } = Tag;
const { TextArea } = Input;

export enum HousePublishFormType {
    EDIT,
    ADD
}
/**
 * 房源发布表单
 */
const HousePublishForm = (props) => {

    const { initData, type } = props;

    const [leaveHint, setLeaveHint] = useState({
        show: true,
        path: ""
    });

    const [regions, setRegions] = useState<address[]>([]);
    const [regionLoading, setRegionLoading] = useState(false);


    // 房屋描述计数
    const [descriptionCount, setDescriptionCount] = useState(0);

    const [buttonLoading, setButtonLoading] = useState(false);

    const history = useHistory();

    const [dirty, setDirty] = useState(false);

    const limits = useSelector(state => state.common.limits);

    const [form] = Form.useForm();

    // 输入框引用
    const [inputRefArray, setRefArray] = useState<any>([]);

    useEffect(() => {
        if (initData) {
            form.setFieldsValue(initData);
            if (initData.city) {
                getSupportRegions(initData.city);
            }
            setDescriptionCount(initData.description?.length || 0)
        }
    }, [initData]);

    const numberValidate = (message, pattern?) => ({
        validator(rule, value) {
            const regx = pattern || /^[0-9]*$/;
            if (!value || regx.test(value)) {
                return Promise.resolve();
            }
            return Promise.reject(message);
        },
    });

    const city = useSelector(state => state.common.city);

    useEffect(() => {
        if (city) {
            getSupportRegions(city.enName);
        }
    }, [city]);


    // 获取区县列表
    const getSupportRegions = (cityEnName) => {
        return handleResponse(AddressApi.getSupportRegions(cityEnName), (data) => setRegions(data.list), "获取区县列表失败", setRegionLoading)
    };

    // 下拉框无数据时内容展示
    const selectNotFound = (loading, description = "暂无数据") => {
        return loading ? <Spin size="small" /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={description} />;
    };

    const handleValuesChange = (changedValue, allValue) => {
        setDirty(true);
        // 如果房屋描述改变
        if (Object.keys(changedValue).indexOf("description") !== -1) {
            setDescriptionCount(changedValue.description?.length || 0);
            return;
        }
    };

    const handleFormFinish = (values) => {
        // 处理表单完成
        const region = regions.find(item => item.enName === values.region)?.cnName;
        const houseForm = {
            ...values,
            cityEnName: city.enName,
            regionEnName: values.region,
            cover: values.picture.imageList.find(item => item.uid === values.picture.cover)?.path,
            pictures: values.picture.imageList.map(item => {
                return {
                    path: item.path,
                    width: item.width,
                    height: item.height
                }
            }),
            tags: values.tags,
            address: region + values.street
        };

        if (type === HousePublishFormType.EDIT) {
            handleEdit(houseForm);
            return;
        }
        if (type === HousePublishFormType.ADD) {
            handlePublish(houseForm);
        }
    };

    // 编辑房源
    const handleEdit = (form) => {
        if (dirty) {
            setButtonLoading(true);
            AdminApi.updateHouse({
                ...form,
                id: initData.id
            }).then(data => {
                setButtonLoading(false);
                if (data) {
                    notification.success({
                        message: '修改成功',
                        description:
                            "您的房源修改成功，可在房源管理下管理该房源",
                    });
                    setLeaveHint({
                        show: false,
                        path: "/user/publish/manage"
                    });
                }
            });
        } else {
            setLeaveHint({
                show: false,
                path: "/user/publish/manage"
            });
        }
    };

    // 发布房源
    const handlePublish = (houseForm) => {
        setButtonLoading(true);
        AdminApi.addHouse(houseForm).then(data => {
            setButtonLoading(false);
            if (data) {
                notification.success({
                    message: '发布成功',
                    description:
                        "您的房源发布成功，可在房源管理下管理该房源",
                });
                setLeaveHint({
                    show: false,
                    path: "/user/publish/manage"
                });
            }
        });
    };

    // 设置不保存路由后跳转路由
    useEffect(() => {
        if (!leaveHint.show) {
            history.push(leaveHint.path);
        }
    }, [leaveHint]);

    // 一键生成描述
    const handleGenerateDescription = () => {
        form.validateFields(["region", "street", "floor", "direction", "area", "rentWay", "price"]).then(res => {
            const values = form.getFieldsValue();
            const region = regions.find(item => item.enName === values.region)?.cnName;
            const location = `位于${region}, ${values.street},入住即与精英为邻;\n`;
            const tags = `${values.tags?.length > 0 ? `房间配套有${values.tags.map(item => item + ",")}\n` : ""}`;

            let traffic = "";
            if (traffic !== "") {
                traffic += "\n";
            }
            const last = `交通便利,附近的,小区周边配套设施齐全`;
            const description = location + tags + traffic + last;
            setDescriptionCount(description.length);
            form.setFieldsValue({ description: description });
        });
    };

    // 处理户型楼层自动聚焦
    const handleAutoFocusInputChange = (value, index, needLength) => {
        console.log("value:" + value + "; index:" + index + "; needLength:" + needLength);
        if (value?.length === needLength) {
            inputRefArray[index].blur();
            inputRefArray[index + 1].focus();
        }
    };

    return (
        <Container>
            <Prompt
                when={dirty && leaveHint.show}
                message='您的修改将不会被保存，是否继续'
            />
            <Form form={form} onValuesChange={handleValuesChange} onFinish={handleFormFinish}>
                {/* 基础信息 ***************************/}
                <Row>
                    <Col span={2} className="row-title-container">
                        <h2 className="title">基础信息</h2>
                    </Col>
                </Row>
                {/* 地址 */}
                <Row>
                    <Col span={2} className="row-title-container">
                        <span className="row-title star">
                            详细地址
                        </span>
                    </Col>
                    <Col className="row-input-container">
                        <Form.Item
                            label=""
                            name="region"
                            rules={[{ required: true, message: '请选择区域' }
                            ]}
                        >
                            <Select style={{ ...formStyle.input, width: 190 }}
                                showSearch={true}
                                optionFilterProp="children"
                                placeholder="请选择区域"
                                notFoundContent={selectNotFound(regionLoading, "无当前城市区域信息")}
                            >
                                {
                                    regions.map((region: address) => <Option key={region.enName} value={region.enName}>{region.cnName}</Option>)
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label=""
                            name="street"
                            rules={[{ required: true, message: '请输入详细地址' }
                            ]}
                        >
                            <Input style={{ ...formStyle.input, width: 190 }} placeholder="请输入详细地址" />
                        </Form.Item>
                    </Col>
                </Row>
                {/* 楼层信息 */}
                <Row>
                    <Col span={2} className="row-title-container">
                        <span className="row-title star">
                            楼层信息
                        </span>
                    </Col>
                    <Col className="row-input-container">
                        <Form.Item
                            label={null}
                            name="floor"
                            rules={[{ required: true, message: '必选' }]}
                        >
                            <Select style={{ ...formStyle.input, width: 120 }} placeholder="请选择楼层">
                                {
                                    HouseFloorList.map(item => <Option value={item.value} key={item.value}>{item.label}</Option>)
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                {/* 房屋出租 */}
                <Row>
                    <Col span={2} className="row-title-container">
                        <span className="row-title star">
                            厂房结构
                        </span>
                    </Col>
                    <Col className="row-input-container">
                        <Form.Item
                            label={null}
                            name="direction"
                            rules={[{ required: true, message: '必选' }]}
                        >
                            <Select style={{ ...formStyle.input, width: 120 }} placeholder="请选择结构">
                                {
                                    HouseDirectionList.map(item => <Option value={item.value} key={item.value}>{item.label}</Option>)
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label={null}
                            name="area"
                            rules={[{ required: true, message: '必填' }, numberValidate("非负整数", /^\+?[1-9][0-9]*$/)]}
                        >
                            <Input style={{ ...formStyle.input, width: 120 }} prefix="共" suffix="㎡" className="input-center" />
                        </Form.Item>
                    </Col>
                </Row>
                {/* 出租信息**************************************************/}
                <Row>
                    <Col span={2} className="row-title-container">
                        <h2 className="title">出租信息</h2>
                    </Col>
                </Row>
                {/* 出租方式 */}
                <Row>
                    <Col span={2} className="row-title-container">
                        <span className="row-title star">
                            出租方式
                        </span>
                    </Col>
                    <Col className="row-input-container">
                        <Form.Item
                            label={null}
                            name="rentWay"
                            rules={[{ required: true, message: '必选' }]}
                        >
                            <Select style={{ ...formStyle.input, width: 120 }} placeholder="租赁方式">
                                <Option value={1}>整租</Option>
                                <Option value={2}>分租</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                {/* 租金信息*/}
                <Row>
                    <Col span={2} className="row-title-container">
                        <span className="row-title star">
                            租金信息
                        </span>
                    </Col>
                    <Col className="row-input-container">
                        <Form.Item
                            label={null}
                            name="price"
                            rules={[{ required: true, message: '必填' }, numberValidate("非负整数", /^\+?[1-9][0-9]*$/)]}
                        >
                            <Input style={{ ...formStyle.input, width: 120 }} suffix="元/月" className="input-center" />
                        </Form.Item>
                    </Col>
                </Row>

                {/* 详细介绍 ***************************/}
                <Row>
                    <Col span={2} className="row-title-container">
                        <h2 className="title">详细介绍</h2>
                    </Col>
                </Row>
                {/* 房源标题 */}
                <Row>
                    <Col span={2} className="row-title-container">
                        <span className="row-title star">
                            房源标题
                        </span>
                    </Col>
                    <Col className="row-input-container">
                        <Form.Item
                            label={null}
                            name="title"
                            rules={[{ required: true, message: '请输入房源标题' }]}
                        >
                            <Input placeholder="请输入房源标题" style={{ ...formStyle.input, width: 400 }} />
                        </Form.Item>
                    </Col>
                </Row>
                {/*    房屋配置 */}
                <Row>
                    <Col span={2} className="row-title-container">
                        <span className="row-title">
                            房屋配置
                        </span>
                    </Col>
                    <Col className="row-input-container">
                        <Form.Item
                            name="tags"
                        >
                            <HouseTags />
                        </Form.Item>
                    </Col>
                </Row>
                {/* 房源描述*/}
                <Row>
                    <Col span={2} className="row-title-container">
                        <span className="row-title star">
                            房源描述
                        </span>
                    </Col>
                    <Col className="row-input-container" style={{ display: "block" }}>
                        <p style={{ cursor: "pointer", color: "#51c6cf", fontSize: "12px", marginBottom: 5 }} onClick={handleGenerateDescription}>快速生成描述</p>
                        <Form.Item
                            name="description"
                            rules={[{ required: true, message: '请输入房源描述' }, { min: 6, message: "房源描述过短" }, { max: 300, message: "描述最多不超过300字" }]}
                        >
                            <TextArea
                                style={{ ...formStyle.input, width: 540, height: 130, marginRight: 0 }}
                                placeholder="可以介绍一下房源亮点，交通、周边环境，可以入住的时间和对租客的要求等，
                                详细的描述会大大增加快速出租的机会！请不要在描述中包含：
                                1.任意形式的联系方式及变型词；
                                2.与房源或相关配套描述无关的内容；3.违反国家法律法规的内容等"
                            />
                        </Form.Item>
                        <div className="text-tip">
                            <span style={{ color: "#FF420A" }}>{descriptionCount}</span>/300
                        </div>
                    </Col>
                </Row>

                {/* 房源图片 ***************************/}
                <Row>
                    <Col span={2} className="row-title-container">
                        <h2 className="title">房源图片</h2>
                    </Col>
                </Row>
                {/*上传图片*/}
                <Row>
                    <Col span={2} className="row-title-container">
                        <span className="row-title star">
                            上传图片
                        </span>
                    </Col>
                    <Col className="row-input-container" span={16}>
                        <Form.Item
                            name="picture"
                            rules={[{ required: true, message: '至少上传一张房屋图片' }]}
                        >
                            <PictureUploader limits={{
                                types: limits.housePhotoTypeLimit,
                                size: limits.housePhotoSizeLimit
                            }} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Button type="primary" htmlType="submit" style={{ width: 260, height: 44, margin: "0 auto" }} loading={buttonLoading}>
                        {
                            type === HousePublishFormType.ADD && (buttonLoading ? "发布中" : "发布")
                        }
                        {
                            type === HousePublishFormType.EDIT && (buttonLoading ? "修改中" : "确认修改")
                        }
                    </Button>
                </Row>
            </Form>
        </Container>
    )
};
const Container = styled.div`
    min-height: 500px;
    padding: 30px 20px;
    border: solid 1px #eee;
    .row-title-container{
        text-align: right;
        margin-right: 20px;
    }
    .row-title{
        line-height: 40px;
        color: #666;
        font-size: 14px;
        color: gray;
    }
    .star{
        &:before{
            content: "*";
            top: 2px;
            margin-right: 2px;
            color: #FF552E;
        }
    }
    .title{
        color: #000;
        font-size: 16px;
        font-weight: bolder;
        padding-bottom: 20px;
    }
    .row-input-container{
        display: flex;
    }
    .ant-input-suffix, .ant-input-prefix{
        color: #a6a6a6;
    }
    .ant-input-affix-wrapper-focused{
         .ant-input-suffix, .ant-input-prefix{
                color: #333 !important;
         }
    }
    .ant-select-selector{
        background-color: #fff;
        border: 1px solid #d9d9d9;
        border-radius: 0px !important;
        -webkit-transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        width: 100%;
        height: 40px !important;
        line-height: 40px !important;
        padding: 0 11px;
    }
    .ant-select-selection-placeholder{
        line-height: 40px !important;
    }
    .ant-select-selection-item{
        line-height: 40px !important;
    }
    .input-center{
        .ant-input{
            text-align: center;
        }
    }
    .ant-tag-checkable{
        border: 1px solid #d9d9d9;
        box-sizing: content-box;
        font-size: 14px;
        color: #a6a6a6;
    }
    .ant-tag-checkable-checked{
        border: 1px solid rgba(0, 0, 0, 0);
        color: #fff;
    }
    .text-tip {
        position: absolute;
        bottom: 30px;
        right: 10px;
        color: #aaa;
        font-size: 12px;
    }
`;
const HouseTags = (props) => {
    const { value = [], onChange } = props;
    // 处理标签点击
    const handleTagChange = (tag, checked) => {
        const nextSelectedTags = checked ? [...value, tag] : value.filter(t => t !== tag);
        handleChange(nextSelectedTags)
    };
    const handleChange = changedValue => {
        if (onChange) {
            onChange(changedValue)
        }
    };
    return (
        <div style={{ display: "flex", alignItems: "center", height: 40 }} >
            {
                HouseTagList.map(tag => <CheckableTag
                    key={tag}
                    checked={value.indexOf(tag) > -1}
                    onChange={checked => handleTagChange(tag, checked)}
                >{tag}</CheckableTag>)
            }
        </div>
    )
};

const formStyle = {
    input: {
        height: 40,
        borderRadius: 0,
        marginRight: 20
    }
};

interface address {
    id: number,
    enName: string,
    cnName: string,
    level: string,
    baiduMapLng: number,
    baiduMapLat: number,
}


export default HousePublishForm;
