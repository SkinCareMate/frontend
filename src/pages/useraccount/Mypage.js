import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { CenterContainer, ContentContainer, MainContainer } from '../../components/container/Container';
import NavigationBar from '../../components/navbar/NavigationBar';
import { getCookie } from '../../Cookie';
import { isAuthenticated } from '../../utils/Auth';
import { useNavigate } from 'react-router-dom';
import Survey from '../Survey';
import Footer from '../../components/container/Footer';

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

const SubNav = styled.div`
    position: fixed;
    left: 200px;
    top: 200px;
    width: 200px;
    height: auto;
    background-color: #f8f8f8;
    padding: 20px;
    box-shadow: 2px 0 10px rgba(0,0,0,0.2);
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const SubNavItem = styled.button`
    background: none;
    border: none;
    font-size: 1.2em;
    cursor: pointer;
    text-align: left;
    color: #333;

    &:hover {
        color: #007bff;
    }
`;

function Mypage() {
    const [name, setName] = useState('');
    const [isSurveyVisible, setIsSurveyVisible] = useState(false);
    const navigate = useNavigate('');

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/signup');
            window.alert('로그인이 필요합니다.');
        }
        const userName = getCookie('username');
        if (userName) {
            setName(userName);
        }
    }, []);

    const toggleSurvey = () => {
        setIsSurveyVisible(!isSurveyVisible);
    };

    const handleScrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        if (sectionId === 'section2') {
            setIsSurveyVisible(true);
        }
    };

    const navigatePast = () => {
        navigate('/llmresult');
    }

    return (
        <MainContainer style={{backgroundColor: '#F8F9FA'}}>
            <NavigationBar />

            <ContentContainer>
                <div id="section2">

                    
                        <SurveyContainer>
                            <Survey />
                        </SurveyContainer>
                    
                </div>

            </ContentContainer>
            <Footer />
        </MainContainer>
    );
}

export default Mypage;
