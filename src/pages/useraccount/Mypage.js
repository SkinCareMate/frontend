import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { CenterContainer, ContentContainer, MainContainer } from '../../components/container/Container';
import NavigationBar from '../../components/navbar/NavigationBar';
import { getCookie } from '../../Cookie';
import { isAuthenticated } from '../../utils/Auth';
import { useNavigate } from 'react-router-dom';

function Mypage() {
    const [name, setName] = useState('');
    const navigate = useNavigate('');

    useEffect(() => {
        if (!isAuthenticated()) {
            window.alert('로그인이 필요합니다.');
            navigate('/');
        }
        const userName = getCookie('username');
        if (userName) {
            setName(userName);
        }
    }, [])

    return (
        <MainContainer>
            <NavigationBar />
            <ContentContainer>
                <CenterContainer>
                    <h1>{name}님</h1>
                </CenterContainer>
            </ContentContainer>
        </MainContainer>
    )
}

export default Mypage;