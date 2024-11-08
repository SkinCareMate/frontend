import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { login } from "../../utils/Auth";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { removeCookie, getCookie } from "../../Cookie"; // getCookie 임포트 추가

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
  font-size: 1.5em;

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
    width: 100px;
  }
`;

const Subnav = styled.div`
  position: relative;
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
  cursor: pointer;
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  padding: 20px;
  border: 1px solid black;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1000;
`;

const ModalTitle = styled.h2`
  margin: 0 0 20px 0;
`;

const InputWrapper = styled.div`
  width: 100%;
  margin-bottom: 15px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: black;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #333;
  }
`;

const FooterLink = styled(Link)`
  margin-top: 10px;
  color: purple;
  text-decoration: none;
  font-size: 0.8em;
`;

const DropdownMenu = styled.div`
  position: absolute;
  width: 120px;
  top: 60px;
  left: 98%;
  transform: translateX(-50%);
  background-color: white;
  border: 1px solid black;
  z-index: 1000;
`;

const DropdownItem = styled(Link)`
  display: block;
  padding: 10px 15px;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }
`;

function NavigationBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [data, setData] = useState({ id: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 컴포넌트가 마운트될 때 로그인 상태를 확인
  useEffect(() => {
    const accessToken = getCookie('accessToken');
    const refreshToken = getCookie('refreshToken');
    if (accessToken && refreshToken) {
      setIsLoggedIn(true); // 두 토큰이 모두 존재하면 로그인 상태로 설정
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleClick = () => {
    if (!isLoggedIn) {
      setShowModal(true);
    } else {
      setShowDropdown((prev) => !prev);
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
      setIsLoggedIn(true);
      navigate("/");
      window.alert("로그인되었습니다.");
      setShowModal(false);
    } catch (error) {
      console.error("로그인 에러:", error.response ? error.response.data : error.message);
      setError("로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowDropdown(false);
    removeCookie('accessToken');
    removeCookie('refreshToken');
    removeCookie('username');
  };

  return (
    <Nav>
      <Logo src="" alt="logo" />
      <Subnav>
        <Link to="/">진단 소개</Link>
        <Link to="/">AI 피부진단</Link>
        <Link to="/">기초화장품 추천</Link>
        <Link to="/">진단 결과</Link>
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
