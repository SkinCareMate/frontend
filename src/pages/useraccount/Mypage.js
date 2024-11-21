import React, { useEffect } from 'react';
import styled from 'styled-components';
import { ContentContainer, MainContainer } from '../../components/container/Container';
import NavigationBar from '../../components/navbar/NavigationBar';
import { isAuthenticated } from '../../utils/Auth';
import { useNavigate } from 'react-router-dom';
import Survey from '../Survey';
import Footer from '../../components/container/Footer';

const SurveyContainer = styled.div`
    margin-top: -100px;
`;


function Mypage() {
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/signup');
            window.alert('로그인이 필요합니다.');
        }

    }, []);

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
