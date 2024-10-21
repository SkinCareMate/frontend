import { Link } from "react-router-dom";
import styled from "styled-components";

const Nav = styled.div`
  border: 1px solid #000;
  height: 100px;
  font-size: 2.5em;
  padding-left: 18.75%; /* 현재 화면 너비의 18.75% */
  padding-right: 18.75%; /* 현재 화면 너비의 18.75% */
  padding-top: 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #ffffff;

  @media (max-width: 1440px) and (min-width: 1024px) {
    padding-left: 10%; /* 화면이 줄어들면 좌우 패딩을 줄여서 공간 확보 */
    padding-right: 10%;
    font-size: 2em; /* 폰트 크기 줄여 공간 확보 */
  }

  @media (max-width: 1024px) {
    padding-left: 5%; /* 작은 화면에서는 패딩을 더 줄임 */
    padding-right: 5%;
    font-size: 1.8em; /* 폰트 크기 추가 조정 */
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
        <Link to="/">AI 피부진단</Link>
        <Link to="/">마이페이지</Link>
        <Link to="/">마이페이지</Link>
        <Link to="/login">로그인</Link>
      </Subnav>
    </Nav>
  );
}

export default NavigationBar;
