import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: #333;
  color: #fff;
  padding: 20px 0;
  width: 100%;
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: center; /* 섹션들을 가운데로 정렬 */
  align-items: flex-start; /* 각 섹션의 상단 정렬 */
  max-width: 1200px; /* 최대 폭을 설정하여 섹션들이 너무 멀어지지 않도록 조정 */
  margin: 0 auto;
  padding: 0 20px;
  flex-wrap: wrap;
  gap: 50px; /* 섹션 간의 간격 조정 */
`;

const FooterSection = styled.div`
  flex: 1;
  min-width: 200px;
  text-align: left; /* 글 왼쪽 정렬 */
  //margin-bottom: 20px;

`;

const FooterBottom = styled.div`
  text-align: center;
  padding: 10px 0;
  border-top: 1px solid #444;
  margin-top: 20px;
`;

const Logo = styled.div`
  width: 250px; /* 로고 크기를 줄여 섹션과 더 가까워지도록 함 */
  text-align: center; /* 로고 이미지 가운데 정렬 */
  margin-top: 30px;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection style={{borderRight: '1px solid #fff'}}>
          <Logo>
            <img src='logo6.png' style={{maxWidth: '100%'}} alt="Logo" />
          </Logo>
        </FooterSection>
        <FooterSection>
          <h4 style={{fontSize: '1.3em', marginLeft: '65px'}}>회사 소개</h4>
          <p style={{marginLeft: '65px'}}> 당신의 피부 상태를 AI로 진단하고<br /><br />알맞은 스킨케어 제품을 추천합니다.</p>
        </FooterSection>
        <FooterSection style={{borderLeft: '1px solid #fff'}}>
          <h4 style={{fontSize: '1.3em', marginLeft: '100px'}}>연락처</h4>
          <p style={{marginLeft: '100px'}}>이메일: contact@skinai.com</p>
          <p style={{marginLeft: '100px'}}>전화: 123-456-7890</p>
        </FooterSection>
      </FooterContent>
      <FooterBottom>
        <p>&copy; 2024 Beauty Story. ALL RIGHTS RESERVED.</p>
      </FooterBottom>
    </FooterContainer>
  );
};

export default Footer;
