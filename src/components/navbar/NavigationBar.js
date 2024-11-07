import { Link } from "react-router-dom";
import styled from "styled-components";

const Nav = styled.div`
  position: fixed;  /* 화면에 고정 */
  top: 0;           /* 화면의 가장 상단에 위치 */
  left: 0;
  right: 0;
  z-index: 1000;    /* 다른 요소들보다 위에 배치되도록 z-index 설정 */
  
  border: 0px solid #000;
  height: 50px;
  font-size: 1.5em;
  height: 80px;
  padding-left: 20%;
  padding-right: 15%;
  padding-top: 25px;
  padding-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #FFFFFF;
  box-shadow: rgba(0, 0, 0, 0.03) 0px 5px 15px;

  @media (max-width: 1440px) and (min-width: 1024px) {
    padding-left: 10%;
    padding-right: 10%;
    font-size: 2em;
  }

  @media (max-width: 1024px) {
    padding-left: 5%;
    padding-right: 5%;
    font-size: 1.8em;
  }
`;


const Logo = styled.img`
  max-width: 100%;
  height: auto;

  @media (max-width: 1024px) {
    width: 100px; /* 작은 화면에서 로고 크기 줄임 */
  }
`;

const Subnav = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 100px; /* 링크 사이의 간격을 줄여 화면 공간을 효율적으로 사용 */
  font-size: 0.8em;

  @media (max-width: 1440px) and (min-width: 1024px) {
    gap: 70px; /* 1024px ~ 1440px 사이에서는 링크 간의 간격을 줄여 공간 확보 */
    font-size: 0.7em; /* 폰트 크기를 줄여 링크들이 가로로 잘 맞도록 */
  }

  @media (max-width: 1024px) {
    gap: 50px; /* 더 작은 화면에서는 간격을 최소화 */
    font-size: 0.6em; /* 폰트 크기 추가 조정 */
  }
`;

function NavigationBar() {

  
  

  return (
    <Nav>
      <Logo src="" alt="logo" />
      <Subnav>
        <Link to="/">진단소개</Link>
        <Link to="/">AI 피부진단</Link>
        <Link to="/">기초화장품 추천</Link>
        <Link to="/">진단 결과</Link>
        <Link to="/login">로그인</Link>
        <Link to="">
          
        </Link>
      </Subnav>
    </Nav>
  );
}

export default NavigationBar;
