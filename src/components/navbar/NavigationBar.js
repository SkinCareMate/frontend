import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { login } from "../../utils/Auth";
import styled from "styled-components";
import React, { useState } from "react";

const Nav = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 80px;
  padding-left: 20%;
  padding-right: 15%;
  padding-top: 25px;
  padding-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #ffffff;
  box-shadow: rgba(0, 0, 0, 0.03) 0px 5px 15px;
  font-size: 1.5em; /* 폰트 크기 추가 */

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
  position: relative; /* 드롭다운 메뉴의 기준 위치를 설정 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 100px;
  font-size: 0.8em;

  @media (max-width: 1440px) and (min-width: 1024px) {
    gap: 70px;
    font-size: 0.7em;
  }

  @media (max-width: 1024px) {
    gap: 50px;
    font-size: 0.6em;
  }
`;

const Img = styled.img`
  width: 50px;
  height: 50px;
  cursor: pointer; /* 클릭 가능하게 설정 */
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px; /* 너비 조정 */
  padding: 20px; /* 내부 여백 추가 */
  border: 1px solid black; /* 검은 테두리 */
  background-color: white; /* 흰 배경 */
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1000; /* 모달이 다른 요소 위에 표시되도록 */
`;

const ModalTitle = styled.h2`
  margin: 0 0 20px 0; /* 제목과 아래 요소 간격 */
`;

const InputWrapper = styled.div`
  width: 100%; /* 너비 100% */
  margin-bottom: 15px; /* 아래 여백 */
`;

const Input = styled.input`
  width: 100%; /* 너비 100% */
  padding: 10px; /* 내부 여백 */
  border: 1px solid #ccc; /* 테두리 색상 */
  border-radius: 5px; /* 모서리 둥글게 */
`;

const LoginButton = styled.button`
  width: 100%; /* 너비 100% */
  padding: 10px; /* 내부 여백 */
  background-color: black; /* 배경 색상 */
  color: white; /* 글자 색상 */
  border: none; /* 테두리 없음 */
  border-radius: 5px; /* 모서리 둥글게 */
  cursor: pointer; /* 클릭 가능하게 설정 */

  &:hover {
    background-color: #333; /* 호버 시 색상 변경 */
  }
`;

const FooterLink = styled(Link)`
  margin-top: 10px; /* 위쪽 여백 */
  color: purple; /* 글자 색상 */
  text-decoration: none; /* 밑줄 없음 */
`;

const DropdownMenu = styled.div`
  position: absolute;
  width: 120px;
  top: 60px; /* Img 바로 아래에 위치 */
  left: 98%; /* 오른쪽으로 이동 */
  transform: translateX(-50%); /* 중앙 정렬 */
  background-color: white;
  border: 1px solid black;
  z-index: 1000; /* 드롭다운 메뉴가 다른 요소 위에 표시되도록 */
`;

const DropdownItem = styled(Link)`
  display: block;
  padding: 10px 15px;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0; /* 호버 시 배경 색상 변경 */
  }
`;

function NavigationBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [data, setData] = useState({ id: "", password: "" });
  const [error, setError] = useState(""); // 오류 메시지 상태 추가
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value }); // 입력값 업데이트
  };

  const handleClick = () => {
    if (!isLoggedIn) {
      setShowModal(true); // 로그인 안 된 상태에서 클릭하면 모달 띄움
    } else {
      setShowDropdown((prev) => !prev); // 로그인 된 상태에서 드롭다운 토글
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleLogin = async () => {
    setError("");

    if (!data.id || !data.password) {
      setError("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      await login(data);
      setIsLoggedIn(true); // 로그인 성공 시 상태 업데이트
      navigate("/"); // 로그인 성공 시 메인페이지로 이동
      window.alert("로그인되었습니다.");
      setShowModal(false); // 로그인 후 모달 닫기
    } catch (error) {
      console.error("로그인 에러:", error.response ? error.response.data : error.message);
      setError("로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false); // 로그아웃 처리
    setShowDropdown(false); // 드롭다운 메뉴 닫기
  };

  return (
    <Nav>
      <Logo src="" alt="logo" />
      <Subnav>
        <Link to="/">진단소개</Link>
        <Link to="/">AI 피부진단</Link>
        <Link to="/">기초화장품 추천</Link>
        <Link to="/">진단 결과</Link>
        <Link to="/login">로그인</Link>
        <Img src="accountimg.png" onClick={handleClick} />
        {showDropdown && (
          <DropdownMenu>
            <DropdownItem to="/mypage">마이페이지</DropdownItem>
            <DropdownItem onClick={handleLogout}>로그아웃</DropdownItem>
          </DropdownMenu>
        )}
      </Subnav>

      {showModal && (
        <Modal>
          <ModalTitle>로그인하기</ModalTitle>
          <InputWrapper>
            <label htmlFor="id">아이디</label>
            <Input
              type="text"
              id="id"
              name="id"
              value={data.id}
              onChange={handleChange}
            />
          </InputWrapper>
          <InputWrapper>
            <label htmlFor="password">비밀번호</label>
            <Input
              type="password"
              id="password"
              name="password"
              value={data.password}
              onChange={handleChange}
            />
          </InputWrapper>
          {error && <p style={{ color: "red", fontSize: "0.8em" }}>{error}</p>}
          <LoginButton onClick={handleLogin}>로그인</LoginButton>
          <FooterLink to="/forgot-password">아이디/비밀번호를 잊으셨나요? | 회원가입</FooterLink>
        </Modal>
      )}
    </Nav>
  );
}

export default NavigationBar;
