import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { CenterContainer, ContentContainer, MainContainer } from '../../components/container/Container';
import NavigationBar from '../../components/navbar/NavigationBar';
import { getCookie } from '../../Cookie';
import { isAuthenticated } from '../../utils/Auth';
import { useNavigate } from 'react-router-dom';
import Survey from '../Survey';

const ToggleButton = styled.button`
    background-color: white;
    font-size: 1.5em;
    border-top: 2px solid #ccc;
    border-bottom: 2px solid #ccc;
    border-left: none;
    border-right: none;
    width: 100%;
    padding: 10px;
    cursor: pointer;
    text-align: left;

    &:hover {
        background-color: #f0f0f0;
    }
`;

const SurveyContainer = styled.div`
    margin-top: -100px;
`;

function Mypage() {
    const [name, setName] = useState('');
    const [isSurveyVisible, setIsSurveyVisible] = useState(false);
    const navigate = useNavigate('');

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/');
            window.alert('로그인이 필요합니다.');
        }
        const userName = getCookie('username');
        if (userName) {
            setName(userName);
        }
    }, [])

    const toggleSurvey = () => {
        setIsSurveyVisible(!isSurveyVisible);
    };

    return (
        <MainContainer>
            <NavigationBar />
            <ContentContainer>
                <h1>{name}님</h1>
                <ToggleButton onClick={toggleSurvey}>
                    {isSurveyVisible ? '▶ 진단 사전 설문' : '▼ 진단 사전 설문'}
                </ToggleButton>
                {isSurveyVisible && (
                    <SurveyContainer>
                        <Survey />
                    </SurveyContainer>
                )}
            </ContentContainer>
        </MainContainer>
    )
}

export default Mypage;