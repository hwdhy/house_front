import React from "react";
import styled from "styled-components";
import ResetPasswordComponent from "@components/ResetPasswordComponent";
import { useSelector, useDispatch } from 'react-redux'


const UserResetPassword = () => {

    const user = useSelector(state => state.user.userInfo);

    return (
        <Container>
            <ResetPasswordComponent phone={user.phoneNumber} />
        </Container>
    )
};
const Container = styled.div`

`;

export default UserResetPassword;
