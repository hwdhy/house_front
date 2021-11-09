import React, { Suspense } from "react";
import styled from "styled-components";
import Loading from "@components/Loading";

const SuspenseComponent = Component => props => {

    return (
        <Suspense fallback={<Loading />}>
            <Component {...props} />
        </Suspense>
    )
};


export default SuspenseComponent;
