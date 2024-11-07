import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ContentContainer, MainContainer } from "../../components/container/Container";
import NavigationBar from "../../components/navbar/NavigationBar";
import styled from "styled-components";

const StyledMainContainer = styled(MainContainer)`
  background-color: #ffffff; /* 연한 녹색 배경을 MainContainer에 설정 */
`;

const CenteredContentContainer = styled(ContentContainer)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 80vh; /* 화면 높이의 80% */
  padding: 40px;
`;

const SignupInfo = styled.div`
  flex: 1;
  margin-right: 20px;
  margin-left: 10%;

  h1 {
    font-size: 2em;
    margin-bottom: 20px;
  }

  p {
    font-size: 1.1em;
    line-height: 1.5;
  }
`;

const SignupForm = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* 세로 중앙 정렬 */
  gap: 20px;
  padding: 30px;
  border: 1px solid #dcdcdc;
  border-radius: 10px;
  background-color: #ffffff;
  height: auto; /* 높이를 자동으로 설정하여 중앙에 맞추기 */
  min-height: 50%; /* 최소 높이 설정 */
  max-height: 600px; /* 최대 높이 설정 */
  overflow-y: auto; /* 내용이 넘칠 경우 스크롤 표시 */

  h1 {
    margin-bottom: 10px;
    font-size: 1.5em;

    @media (max-height: 800px) {
      font-size: 1.2em; /* 화면 높이가 작아질 경우 h1 크기 줄임 */
    }
  }
`;

const InputWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr; /* 2열 배치 */
  gap: 15px;
  width: 100%;
  max-width: 500px;

  label {
    display: block;
    margin-bottom: 5px;
    font-size: 0.9em;
    font-weight: bold;

    @media (max-height: 800px) {
      font-size: 0.8em; /* 화면 높이가 작아질 경우 label 폰트 크기 줄임 */
    }
  }

  input {
    padding: 10px;
    font-size: 1em;
    border: 1px solid #dcdcdc;
    border-radius: 5px;
    width: 100%;
    box-sizing: border-box;

    @media (max-height: 800px) {
      padding: 8px; /* 화면 높이가 작아질 경우 padding 줄임 */
      font-size: 0.9em; /* 폰트 크기 줄임 */
    }

    @media (max-height: 600px) {
      padding: 6px; /* 화면 높이가 더 작아질 경우 padding 줄임 */
      font-size: 0.8em; /* 폰트 크기 줄임 */
    }
  }
`;

const SignupButton = styled.button`
  padding: 10px 20px;
  background-color: #d3e4b8; /* 버튼 배경 색상 */
  border: none;
  border-radius: 5px;
  font-size: 1em;
  cursor: pointer;
  margin-top: 20px;

  &:hover {
    background-color: #c1d8a8;
  }

  @media (max-height: 800px) {
    padding: 8px 16px; /* 화면이 작아질 경우 버튼 크기 줄임 */
    font-size: 0.9em;
  }

  @media (max-height: 600px) {
    padding: 6px 12px; /* 더 작은 화면에서는 패딩을 줄임 */
    font-size: 0.8em;
  }
`;


function Signup() {
  const [data, setData] = useState({
    id: "",
    age: "",
    name: "",
    email: "",
    password: "",
    confirm_password: ""
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

  const handleSignup = async () => {
    setError("");

    // 유효성 검사
    if (!data.id || !data.age || !data.name || !data.email || !data.password || !data.confirm_password) {
      setError("모든 필드를 입력해주세요.");
      return;
    }

    if (data.password !== data.confirm_password) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await axios.post("api/accounts/register/", {
        id: data.id,
        age: data.age,
        name: data.name,
        email: data.email,
        password: data.password,
        confirm_password: data.confirm_password
      });

      if (response.status === 201) {
        window.alert("회원가입이 완료되었습니다!");
        navigate("/"); // 회원가입 성공 시 메인페이지로 이동
      }
    } catch (error) {
      console.error("회원가입 에러:", error);
      setError("회원가입에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <StyledMainContainer>
      <NavigationBar />
      <CenteredContentContainer>
        <SignupInfo>
          <h1>회원가입</h1>
          <p>AI로 확인하는 나의 피부 상태<br />회원가입하고 5초만에 확인해보세요</p>
        </SignupInfo>
        <SignupForm>
          <InputWrapper>
            <div>
              <label htmlFor="id">아이디</label>
              <input
                type="text"
                id="id"
                name="id"
                value={data.id}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="age">나이</label>
              <input
                type="text"
                id="age"
                name="age"
                value={data.age}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="name">이름</label>
              <input
                type="text"
                id="name"
                name="name"
                value={data.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email">이메일</label>
              <input
                type="email"
                id="email"
                name="email"
                value={data.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password">비밀번호</label>
              <input
                type="password"
                id="password"
                name="password"
                value={data.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="confirm_password">비밀번호 확인</label>
              <input
                type="password"
                id="confirm_password"
                name="confirm_password"
                value={data.confirm_password}
                onChange={handleChange}
              />
            </div>
          </InputWrapper>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <SignupButton onClick={handleSignup}>회원가입</SignupButton>
        </SignupForm>
      </CenteredContentContainer>
    </StyledMainContainer>
  );
}

export default Signup;
