// Footer.js
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
  justify-content: space-between;
  max-width: 3000px;
  margin: 0 auto;
  padding: 0 20px;
  flex-wrap: wrap;
`;

const FooterSection = styled.div`
  flex: 1;
  min-width: 200px;
  margin-bottom: 20px;
    padding-left: 300px;
`;

const FooterLinks = styled.ul`
  list-style: none;
  padding: 0;
`;

const FooterLinkItem = styled.li`
  margin-bottom: 10px;
`;

const FooterLink = styled.a`
  color: #fff;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const FooterBottom = styled.div`
  text-align: center;
  padding: 10px 0;
  border-top: 1px solid #444;
  margin-top: 20px;
`;

const Logo = styled.div`
  width: 300px;
  background-color: white;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <Logo>
            <img src='logo5.png' style={{maxWidth: '100%'}}></img>
          </Logo>
          <h4>회사 소개</h4>
          <p>당신의 피부 상태를 AI로 진단하고 알맞은 스킨케어 제품을 추천합니다.</p>
        </FooterSection>
        <FooterSection>
          <h4>유용한 링크</h4>
          <FooterLinks>
            <FooterLinkItem><FooterLink href="/about">회사 소개</FooterLink></FooterLinkItem>
            <FooterLinkItem><FooterLink href="/services">서비스</FooterLink></FooterLinkItem>
            <FooterLinkItem><FooterLink href="/contact">문의하기</FooterLink></FooterLinkItem>
          </FooterLinks>
        </FooterSection>
        <FooterSection>
          <h4>연락처</h4>
          <p>이메일: contact@skinai.com</p>
          <p>전화: 123-456-7890</p>
        </FooterSection>
      </FooterContent>
      <FooterBottom>
        <p>&copy; 2024 Beauty Story. 모든 권리 보유.</p>
      </FooterBottom>
    </FooterContainer>
  );
};

export default Footer;
