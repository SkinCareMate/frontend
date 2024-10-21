import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../utils/Auth";
import { ContentContainer, MainContainer } from "../../components/container/Container";
import NavigationBar from "../../components/navbar/NavigationBar";
import styled from "styled-components";

const CenteredContentContainer = styled(ContentContainer)`
  display: flex;
  flex-direction: column; /* 요소들을 세로로 배치 */
  align-items: center; /* 수평 중앙 정렬 */
  justify-content: center; /* 수직 중앙 정렬 */
  height: 80vh; /* 화면 높이의 80% */
`;

const LoginForm = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  width: 25%;

  h1 {
    margin-bottom: 10px;
    font-size: 1.5em;
  }
`;

const InputWrapper = styled.div`
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 5px;

  label {
    font-size: 0.9em;
    font-weight: bold;
  }

  input {
    padding: 10px;
    font-size: 1em;
    border: 1px solid #dcdcdc;
    border-radius: 5px;
    width: 100%;
  }
`;

const LoginButton = styled.button`
  padding: 10px 20px;
  background-color: #d3e4b8; /* 버튼 배경 색상 */
  border: none;
  border-radius: 5px;
  font-size: 1em;
  cursor: pointer;
  width: 100%;

  &:hover {
    background-color: #c1d8a8;
  }
`;

const LinkWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 300px;

  a {
    font-size: 0.9em;
    text-decoration: none;
    color: #000;

    &:hover {
      text-decoration: underline;
    }
  }
`;

function Login() {
  const [data, setData] = useState({
    id: "",
    password: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value
    });
  };

  const handleLogin = async () => {
    setError("");

    if (!data.id || !data.password) {
      setError("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      await login(data);
      navigate("/"); // 로그인 성공 시 메인페이지로 이동
    } catch (error) {
      console.error("로그인 에러:", error);
      setError("로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.");
    }
  };

  return (
    <MainContainer>
      <NavigationBar />
      <CenteredContentContainer>
        <LoginForm>
          <h1>로그인</h1>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <InputWrapper>
            <label htmlFor="id">아이디</label>
            <input
              type="text"
              id="id"
              name="id"
              value={data.id}
              onChange={handleChange}
            />
          </InputWrapper>
          <InputWrapper>
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              name="password"
              value={data.password}
              onChange={handleChange}
            />
          </InputWrapper>
          <LoginButton onClick={handleLogin}>로그인</LoginButton>
          <LinkWrapper>
            <a href="/find-password">비밀번호 찾기</a>
            <a href="/signup">회원가입</a>
          </LinkWrapper>
        </LoginForm>
      </CenteredContentContainer>
    </MainContainer>
  );
}

export default Login;
