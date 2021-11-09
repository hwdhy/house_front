import React, { useEffect, useState } from "react";
import HousePublishForm, { HousePublishFormType } from "@views-client/user/common/HousePublishForm";
import AdminApi from "@apis/admin";
import { notification } from "antd";
import { useHistory } from "react-router";

/**
 * 房源发布
 */
const HousePublish = () => {

    return (
        <HousePublishForm type={HousePublishFormType.ADD} />
    )
};

export default HousePublish;
